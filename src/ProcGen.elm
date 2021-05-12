module ProcGen exposing (..)

import Random
import Random.List
import Random.Extra
import Dict 
import Array
import List.Extra

import Board exposing (Piece, Shape(..), Color(..), Board, Tile, Field(..), emptyScore, ScoreDict, Property, PieceDict, TileDict, Board)

avgRowReq : Int -> Float
avgRowReq level = (toFloat level * 2 + 2) / 3

generateBoard : Int -> Random.Generator Board
generateBoard level =
        Random.constant 
            { tiles =
                Array.repeat 4 <|
                    Array.repeat 4 (NonTile False)
            , pieces = Dict.empty
            , highlight = []
            , rowReqs = Dict.empty
            , colReqs = Dict.empty
            }
            |> Random.andThen (addWalls level)
            |> Random.map2 (\rowReqs model -> { model | rowReqs = rowReqs} ) (generateRowReqs level)
            |> Random.map2 (\colReqs model -> { model | colReqs = colReqs} ) (generateRowReqs level)
        
--At level 4 you start to have a chance to generate 3 walls, before that its always 2
--After level 4, each level adds a 10% chance to add a third wall up to 13 what the chance caps
--at 100%
addWalls : Int -> Board -> Random.Generator Board
addWalls level board =
    let 
        xs = Random.List.shuffle [0,1,2,3]
        ys = Random.List.shuffle [0,1,2,3]
        cords = Random.map2 (List.map2 Tuple.pair) xs ys
        threeWalls = Random.map ((<=) (level - 3)) <| Random.int 1 10
        wallPos =  Random.map2
            (\cord threeW -> if threeW then List.take 2 cord else List.take 3 cord)
            cords
            threeWalls
    in Random.map
        (\positions -> 
             List.foldr (\ind brdf -> Board.set ind (Wall False) brdf) board positions
        )
        wallPos

splitTo2 : Int -> Random.Generator (List Int)
splitTo2 num =
    let head =
            Random.int
                (ceiling <| (toFloat num) / 3)
                (floor <| (toFloat <| num * 2) / 3)
    in Random.map (\x -> [x, num - x]) head

splitTo3 : Int -> Random.Generator (List Int)
splitTo3 num =
    let head =
            Random.int
                (ceiling <| (toFloat num) / 6)
                (floor <| (toFloat num) / 2)
        tail = Random.map2 (-) (Random.constant num) head
    in Random.map2 (::) head (Random.andThen splitTo2 tail)

generateColor : Random.Generator Board.Color
generateColor =
    Random.uniform Purple [Green, Yellow, Orange]

generateSecondColor : Board.Color -> Random.Generator Board.Color
generateSecondColor firstColor =
    if firstColor == Purple then
        Random.weighted (0.3, Purple) <| List.map (Tuple.pair (3/12)) [Green, Yellow, Orange]
    else
        Random.weighted (0.3, firstColor)
            <| List.map (Tuple.pair (3/12))
            <| List.Extra.remove firstColor [Purple, Green, Yellow, Orange]

generateReq : Int -> Random.Generator Board.Score
generateReq sum =
    if sum <= 3 then
        generateSingleColorReq sum
    else
        let values = splitTo2 sum
            fstColor = generateColor
            sndColor = Random.andThen generateSecondColor fstColor
            toScore vals fstCol sndCol =
                case vals of
                    [fstVal, sndVal] ->
                        List.Extra.updateIf ((==) fstCol << Tuple.first)
                            (Tuple.mapSecond ((+) fstVal))
                            <| List.Extra.setIf ((==) sndCol << Tuple.first) (sndCol, sndVal)
                            emptyScore
                    _ -> emptyScore
        in Random.map3 toScore values fstColor sndColor

generateSingleColorReq : Int -> Random.Generator Board.Score
generateSingleColorReq sum =
    Random.map
        (\color -> List.Extra.setIf ((==) color << Tuple.first) (color, sum) emptyScore)
        generateColor
    
generateRowReqs : Int -> Random.Generator ScoreDict
generateRowReqs level =
    let sum = level * 2 + 1
        sums = if sum < 5 then Random.constant [sum] else
                   if sum < 9 then splitTo2 sum else splitTo3 sum
        reqs = Random.andThen (Random.Extra.traverse generateReq) sums
        toScoreDict scoreList indexList =
            Dict.fromList
                <| List.Extra.zip indexList
                <| List.map (\x -> (x, emptyScore)) scoreList
    in Random.map2 toScoreDict reqs <| Random.List.shuffle [0,1,2,3]

pRound : Float -> Random.Generator Int
pRound float =
    let prob = float - (toFloat <| floor float)
    in Random.map ((+) (floor float)) <| Random.weighted (prob, 1) [(1-prob, 0)]
        
generate2Piece : Int -> Random.Generator Piece
generate2Piece level =
    let reqNum = pRound <| toFloat (level * 2 + 2) / 6
    in reqNum
        |> Random.andThen generateSingleColorReq
        |> Random.map (\req -> 
            { shape = Twoi Board.twoiStartIndex
            , borderTransform = {rotate = 0, translate = (0,0)}
            , drawPosition = Nothing
            , positions = []
            , req = req
            , score = emptyScore
            , level = level
            })

generate3Piece : Int -> Random.Generator Piece
generate3Piece level =
    let reqNum = pRound <| toFloat (level * 2 + 2) / 4
    in reqNum
        |> Random.andThen generateReq
        |> Random.map2 (\shape req -> 
            { shape = shape
            , borderTransform = {rotate = 0, translate = (0,0)}
            , drawPosition = Nothing
            , positions = []
            , req = req
            , score = emptyScore
            , level = level
            })
            (Random.uniform (Threei Board.threeiStartIndex) [Threel Board.threelStartIndex])

generate4Piece : Int -> Random.Generator Piece
generate4Piece level =
    let reqNum = pRound <| toFloat (level * 2 + 2) / 3
    in reqNum
        |> Random.andThen generateReq
        |> Random.map2 (\shape req -> 
            { shape = shape
            , borderTransform = {rotate = 0, translate = (0,0)}
            , drawPosition = Nothing
            , positions = []
            , req = req
            , score = emptyScore
            , level = level
            })
            (Random.uniform (Fouro Board.fouroStartIndex)
                 [ Fourt Board.fourtStartIndex
                 , Fours Board.foursStartIndex
                 , Fourz Board.fourzStartIndex
                 , Fourl Board.fourlStartIndex
                 ]
            )

generatePieceDict : Int -> Random.Generator PieceDict
generatePieceDict level =
    let fieldSum = 10 + level * 2
        nextPiece randPieceList size =
            let next =
                    case size of
                        2 -> generate2Piece level
                        3 -> generate3Piece level
                        _ -> generate4Piece level
            in Random.map2 (::) next randPieceList

        go sumLeft pieceList =
            case sumLeft of
                0 -> pieceList
                2 -> nextPiece pieceList 2
                3 -> nextPiece pieceList 3
                4 -> Random.andThen
                         (\randInt -> go (sumLeft - randInt) <| nextPiece pieceList randInt)
                         (Random.weighted (2,2) [(5,4)])
                5 -> Random.andThen 
                         (\randInt -> go (sumLeft - randInt) <| nextPiece pieceList randInt)
                         (Random.weighted (2,2) [(3,3)])
                _ -> Random.andThen 
                         (\randInt -> go (sumLeft - randInt) <| nextPiece pieceList randInt)
                         (Random.weighted (2,2) [(3,3), (5,4)])
    in Random.map (Dict.fromList << List.indexedMap Tuple.pair) (go fieldSum <| Random.constant [])

--TILE

defaultTile : Random.Generator Tile
defaultTile = 
    Random.constant 
        { color = Green
        , baseValue = 1
        , currentValue = 1
        , prodBonus = 0
        , addBonus = 0
        , properties = []
        , drawPosition = Nothing
        , level = 1
        }

generateBase : Int -> Tile -> Random.Generator Tile
generateBase level tile =
    let is3Tile = Random.map ((>) (toFloat level * 0.015 + 0.05)) <| Random.float 0 1
        is2Tile = Random.map ((>) (toFloat level * 0.025 + 0.15)) <| Random.float 0 1
        updateTileBaseVal three two uTile =
            if three then
                { uTile | baseValue = 3 }
            else if two then
                     { uTile | baseValue = 2 }
                 else
                     { uTile | baseValue = 1 }
        updateTileColor col uTile =
            { uTile | color = col }
    in Random.constant tile
        |> Random.map3 updateTileBaseVal is3Tile is2Tile
        |> Random.map2 updateTileColor generateColor

generateTile : Int -> Random.Generator Tile
generateTile level =
    let baseTile = Random.andThen (generateBase level) defaultTile
        genProperties roll1 roll2 =
            if roll1 <= level then
                if roll1 + roll2 <= level then
                    Random.list 2 (generateProperty level)
                else
                    Random.list 1 (generateProperty level)
            else
                Random.constant []
    in Random.map2
        (\tile props -> { tile | properties = props })
        baseTile
        <| Random.Extra.andThen2 genProperties (Random.int 1 8) (Random.int 1 8)

--PROPERTY
                   
addBonusChances : List (Float, Float)
addBonusChances =
    [(0.001,0), (0.002,0), (0.004,0), (0.008,0.02), (0.016,0.05), (0.024,0.1), (0.032,0.1)]

prodBonusChances : List (Float, Float)
prodBonusChances =
    [(0.008,0), (0.016,0.1), (0.032, 0.1)]

generateAddBonus : Int -> Random.Generator Float
generateAddBonus level =
    let chances =
            List.Extra.zip
                (List.map (\(scale,base) -> toFloat level * scale + base) addBonusChances)
                [4, 3.5, 3, 2.5, 2, 1.5, 1]
        go chanceValPairs =
            case chanceValPairs of
                (chance, val) :: cs ->
                    Random.andThen
                        (\roll -> if roll < chance then Random.constant val
                             else go cs
                        )
                        <| Random.float 0 1
                [] ->
                    Random.constant 0
    in go chances

generateProdBonus : Int -> Random.Generator Float
generateProdBonus level =
    let chances =
            List.Extra.zip
                (List.map (\(scale,base) -> toFloat level * scale + base) prodBonusChances)
                [1.5, 1, 0.5]
        go chanceValPairs =
            case chanceValPairs of
                (chance, val) :: cs ->
                    Random.andThen
                        (\roll -> if roll < chance then Random.constant val
                             else go cs
                        )
                        <| Random.float 0 1
                [] ->
                    Random.constant 0
    in go chances

generateBonus : Int -> Property -> Random.Generator Property
generateBonus level property =
    Random.map3
        (\add prod prop -> { prop | addBonus = add, prodBonus = prod })
        (generateAddBonus level)
        (generateProdBonus level)
        (Random.constant property)

generate2Region : Int -> Property -> Random.Generator Property
generate2Region level property =
    let req = pRound <| (avgRowReq level) / 2
        region = Random.uniform Board.prop2OpEdge
                     [ Board.prop2OpCorn
                     , Board.prop2Corn1
                     , Board.prop2Corn2
                     ]
        update requ regi prop =
            { prop | reqValue = requ, region = regi }
    in Random.map3 update req region <| Random.constant property

generate3Region : Int -> Property -> Random.Generator Property
generate3Region level property =
    let req = pRound <| 3 * (avgRowReq level) / 4
        region = Random.uniform Board.prop3Corn [Board.prop3Edge]
        update requ regi prop =
            { prop | reqValue = requ, region = regi }
    in Random.map3 update req region <| Random.constant property

    
generate4Region : Int -> Property -> Random.Generator Property
generate4Region level property =
    let req = pRound <| avgRowReq level
        region = Random.uniform Board.prop4Edge
                     [ Board.prop4Corn
                     , Board.prop4Double1
                     , Board.prop4Double2
                     ]
        update requ regi prop =
            { prop | reqValue = requ, region = regi }
    in Random.map3 update req region <| Random.constant property

generatePropertyColor : Property -> Random.Generator Property
generatePropertyColor prop =
    Random.map (\color -> { prop | reqColor = color }) generateColor

generateProperty : Int -> Random.Generator Property
generateProperty level =
    let bonus =
            Random.map2 
                (\add prod -> if add == 0 && prod == 0 then (1,0) else (add, prod))
                (generateAddBonus level)
                (generateProdBonus level)
        baseProp =
            Random.map2
                (\color (add, prod) ->
                     { region = []
                     , reqColor = color
                     , reqValue = 0
                     , prodBonus = prod
                     , addBonus = add
                     , isMet = False
                     }
                )
                generateColor
                bonus
        addRegion prop size =
            case size of
                2 -> Random.andThen (generate2Region level) prop
                3 -> Random.andThen (generate3Region level) prop
                _ -> Random.andThen (generate4Region level) prop
    in Random.andThen (addRegion baseProp)
        (Random.weighted (4,2) [(2,3), (4,4)])
    
