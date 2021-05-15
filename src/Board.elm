module Board exposing (..)

import Array exposing (Array)
import Html exposing (..)
import Html.Attributes as Attributes
import Html.Events as Events
import Json.Decode as Decode
import Dict exposing (Dict)
import Svg
import Svg.Attributes as Svga
import Svg.Events as Svge
import List.Extra

import Items exposing (..)
                        
type BoardErr
    = PieceToRemoveIsNotEmpty Int
    | NoPieceOnBoardWithId Int
    | CannotAddTileFieldNotEmpty Index
    | CannotAddPieceFieldIsOccupied
    | CannotInsertPieceDrawPositionNothing
    | CannotInsertTileDrawPositionNothing
    | CannotFindIndexByPiece

type alias Board =
    { tiles : BoardTiles
    , pieces : List Piece
    , highlight : List Index 
    , rowReqs : ScoreDict
    , colReqs : ScoreDict
    }

type alias BoardTiles = Array (Array Field)

type alias ScoreDict = Dict Int (Score, Score)
      
drawRowReq : Board -> Int -> Html msg
drawRowReq board index =
    case Dict.get index board.rowReqs of
        Just (reqs, scores) ->
            div [ Attributes.style "grid-column" "1"
                , Attributes.style "grid-row" <| String.fromInt (index + 2)
                , Attributes.style "display" "flex"
                , Attributes.style "flex-direction" "column"
                , Attributes.style "font-size" "1.8vw"
                , Attributes.class "noselect"
                ] <| List.concat ( List.map2 drawReq scores reqs )
        Nothing ->
            div [ Attributes.style "grid-column" "1"
                , Attributes.style "grid-row" <| String.fromInt (index + 2)
                ] []
        
drawColReq : Board -> Int -> Html msg
drawColReq board index =
    case Dict.get index board.colReqs of
        Just (reqs, scores) ->
            div [ Attributes.style "grid-column" <| String.fromInt (index + 2)
                , Attributes.style "grid-row" "1"
                , Attributes.style "display" "flex"
                , Attributes.style "flex-direction" "column"
                , Attributes.style "font-size" "1.8vw"
                , Attributes.class "noselect"
                ] <| List.concat ( List.map2 drawReq scores reqs )
        Nothing ->
            div [ Attributes.style "grid-column" <| String.fromInt (index + 2)
                , Attributes.style "grid-row" "1"
                ] []           


highlightBoard : Board -> Drag -> Board
highlightBoard board drag =
    case drag of
        DragPiece piece ->
            highlightPiece board piece
        _ -> board

highlightPiece : Board -> Piece -> Board
highlightPiece board piece =
    let highlightedTiles =
            List.foldr (\index brd -> update (setHighlight True) brd index)
                board
                piece.positions
    in { highlightedTiles | highlight = piece.positions }
                

removeHighlight : Board -> Board
removeHighlight board =
    let highlightedTiles =
            List.foldr (\index brd -> update (setHighlight False) brd index)
                board
                board.highlight
    in { highlightedTiles | highlight = [] }

insertPiece : Piece -> Board -> Result BoardErr Board
insertPiece piece board =
    let canAdd =
            List.all
                (\index -> case get index board of
                               Just (NonTile _) -> True
                               _ -> False
                )
                piece.positions
        --(newId, newDict) = addToPieceDict piece board.pieces
    in if canAdd then
           if piece.drawPosition == Nothing then
               Err CannotInsertPieceDrawPositionNothing
           else
               Ok <| List.foldr
                        (\ind brd -> { brd | tiles = .tiles <| set ind (Empty piece.id False) brd } )
                        { board | pieces = piece :: board.pieces}
                        piece.positions
       else
           Err CannotAddPieceFieldIsOccupied

toList : Array (Array a) -> List (List a)
toList array =
    Array.toList <| Array.map Array.toList array

indexedMap : ((Int, Int) -> Field -> a) -> BoardTiles -> Array (Array a)
indexedMap f board =
    Array.indexedMap
        (\col ->
             Array.indexedMap
                 (\row -> f (row, col))
        )
        board

get : Index -> Board -> Maybe Field
get (col, row) board =
    Maybe.andThen (Array.get col) <| Array.get row board.tiles

set : Index -> Field -> Board -> Board
set (xIndex, yIndex) field board =
    let mRow = Maybe.map (Array.set xIndex field) <| Array.get yIndex board.tiles
    in case mRow of
           Nothing ->
               board
           Just row ->
               { board | tiles = Array.set yIndex row board.tiles }

update : (Field -> Field) -> Board -> Index -> Board
update f board index =
    case get index board of
        Just field -> set index (f field) board
        Nothing -> board

removeTile : Index -> Board -> Board
removeTile index board =
    case get index board of
        Just (Filled pieceId _ highlight) ->
            let removed =
                    updateAroundTile index
                        <| set index (Empty pieceId highlight) board
            in updateScoreOnTileChange removed index
        _ -> board

checkIfPieceEmpty : Piece -> Board -> Bool
checkIfPieceEmpty piece board =
    List.all
        (\ind -> case get ind board of
                     Just (Empty _ _) -> True
                     _ -> False)
        piece.positions

removePiece : Board -> Int -> Result BoardErr (Board, Piece)
removePiece board id =
    case List.Extra.find ((==) id << .id) board.pieces of
        Just piece ->
            if checkIfPieceEmpty piece board then
                let updatedPieces =
                        List.filter ((/=) id << .id) board.pieces -- Dict.remove id board.pieces
                in Ok <| ( List.foldr
                             (\index brd -> set index (NonTile False) brd)
                             { board | pieces = updatedPieces }
                             piece.positions
                         , piece
                         )
            else Err <| PieceToRemoveIsNotEmpty id
                                
        Nothing ->
            Err <| NoPieceOnBoardWithId id

   
insertDrag : Board -> Drag -> Result BoardErr Board
insertDrag board drag =
    case drag of
        DragPiece piece ->
            insertPiece piece board
        DragTile tile ->
            insertTile tile board
        _ -> Ok board
                     
drawBoard : Board -> Html Msg
drawBoard board =
   Svg.svg
       [ Svga.viewBox "0 0 210 210"
       ] <|
       (List.map drawPieceBorder board.pieces) ++
       (List.concat << toList) (indexedMap drawField board.tiles) 

--SCORE

addScoresInRegion : Board -> List Index -> Score
addScoresInRegion board region =
    let folding index score =
            case get index board of
                Just (Filled _ tile _) ->
                    List.Extra.updateIf
                        ((==) tile.color << Tuple.first)
                        (Tuple.mapSecond <| (+) tile.currentValue)
                        score
                _ -> score
    in List.foldr folding emptyScore region

calculatePieceScore : Board -> Piece -> Piece
calculatePieceScore board piece =
    { piece | score = addScoresInRegion board piece.positions }

calculateRowScore : Board -> Int -> Board
calculateRowScore board index =
    { board | rowReqs =
          Dict.update index
              (Maybe.map <|
                   (\(req, score) ->
                        (req, addScoresInRegion board <| List.map (\x -> (x,index)) [0,1,2,3]
                        )
                   )
              )
              board.rowReqs
    }

calculateColScore : Board -> Int -> Board
calculateColScore board index =
    { board | colReqs =
          Dict.update index
              (Maybe.map <|
                   (\(req, score) ->
                        (req, addScoresInRegion board <| List.map (\y -> (index, y)) [0,1,2,3]
                        )
                   )
              )
              board.colReqs
    }

-- isScoreLower : Score -> Score -> Bool
-- isScoreLower score req =
--     List.map2 (<)
--         (List.map Tuple.second score)
--         (List.map Tuple.second req)
--         |> List.all (\a -> a)

-- isScoreHigher : Score -> Score -> Bool
-- isScoreHigher score req =
--     List.map2 (>)
--         (List.map Tuple.second score)
--         (List.map Tuple.second req)
--         |> List.all (\a -> a) 

--FIELD

type alias Highlight = Bool

setHighlight : Highlight -> Field -> Field
setHighlight highlight field =
    case field of
        NonTile _ -> NonTile highlight
        Empty pieceId _ -> Empty pieceId highlight
        Filled pieceId tile _ -> Filled pieceId tile highlight
        Wall _ -> Wall highlight
    
type Field
    = NonTile Highlight
    | Empty Int Highlight
    | Filled Int Tile Highlight
    | Wall Highlight
      
drawField :Index -> Field -> Svg.Svg Msg
drawField index field =
    case field of
        NonTile highlight ->
            drawFieldRect index highlight
                [ Svga.fill "#e5e5e5" ]
                [ Events.onMouseOver <| DragOverField index
                , Events.onMouseLeave DragLeave
                ]
        Empty pieceId highlight ->
            drawFieldRect index highlight
                [ Svga.fill "#ddb892" ]
                [ Events.onMouseOver <| DragOverField index 
                , Events.onMouseLeave DragLeave
                , Events.onMouseDown <| DragFromBoardStart index
                ]
        Wall highlight ->
            drawFieldRect index highlight
                [ Svga.fill "grey" ] []
        Filled pieceId tile highlight ->
           drawTile index pieceId tile highlight

drawFieldRect : Index -> Highlight -> List (Svg.Attribute msg) -> List (Svg.Attribute msg) -> Svg.Svg msg
drawFieldRect (xIndex, yIndex) highlight rectAtr groupAtr =
    Svg.svg
        ( [ Svga.viewBox "0 0 50 50"
          , Svga.x <| String.fromInt (xIndex * 52 + 2)
          , Svga.y <| String.fromInt (yIndex * 52 + 2)
          , Svga.width "50"
          , Svga.height "50"
          ] ++ groupAtr ) <|
        [ Svg.rect
          ( [ Svga.x "0"
            , Svga.y "0"
            , Svga.width "50"
            , Svga.height "50"
            ] ++ rectAtr )[] 
        ] ++ drawHighlight highlight

drawHighlight : Highlight -> List (Svg.Svg msg)
drawHighlight highlight =
    if highlight then
        [ Svg.rect
            [ Svga.x "0"
            , Svga.y "0"
            , Svga.width "50"
            , Svga.height "50"
            , Svga.fill "blue"
            , Svga.opacity "0.2"
            ] []
        ]
    else []

checkProperty : Index -> Property -> Board -> Bool
checkProperty (xIndex, yIndex) property board =
    property.reqValue <= (List.sum <|
        List.map
            (\(x,y) ->
                 case get (xIndex + x, yIndex + y) board of
                     Just (Filled _ tile _) ->
                         if tile.color == property.reqColor then
                             tile.currentValue
                         else
                             0
                     _ ->
                         0
            )
            property.region )

updateTile : Tile -> Index -> Board -> Tile
updateTile tile index board =
    let checkedProps =
            List.map
                (\prop -> if checkProperty index prop board then
                              { prop | isMet = True }
                          else
                              { prop | isMet = False }
                )
                tile.properties
        addBonus =
            List.filter .isMet checkedProps
                |> List.map .addBonus
                |> List.sum
        prodBonus = 
            List.filter .isMet checkedProps
                |> List.map .prodBonus
                |> List.sum
    in { tile | properties = checkedProps
              , addBonus = addBonus
              , prodBonus = prodBonus
              , currentValue = 
                  floor (toFloat tile.baseValue * (prodBonus + 1) + addBonus)
       }
   
checkAroundTile : Index -> Board -> List (Field, Index)
checkAroundTile tileIndex board =
    List.filterMap
        (\index ->
             case get index board of
                 Just (Filled pieceId tile highlight) ->
                     let updatedTile = updateTile tile index board
                     in if tile.currentValue == updatedTile.currentValue then
                            Nothing
                        else
                            Just (Filled pieceId updatedTile highlight, index)
                 _ ->
                     Nothing
        )
        (neighbourIndexes tileIndex)

neighbourIndexes : Index -> List Index
neighbourIndexes (xIndex, yIndex) =
    let difs = [(-1,1), (0,1),(1,1)
               ,(-1,0),       (1,0)
               ,(-1,-1),(0,-1),(1,-1)
               ]
    in List.filter
        (\(a,b) -> a >=0 && a <=3 && b >= 0 && b <= 3)
        <| List.map (\(a,b) -> (a + xIndex, b + yIndex)) difs

updateAroundTile : Index -> Board -> Board
updateAroundTile index board =
    let updatables = checkAroundTile index board
        updatedBoard =
            List.foldr
                (\(field, ind) brd ->
                     updateScoreOnTileChange (set ind field brd) ind
                )
                board
                updatables
    in List.foldr updateAroundTile updatedBoard (List.map Tuple.second updatables)

insertTile : Tile -> Board -> Result BoardErr Board
insertTile tile board =
    case tile.drawPosition of
        Just index ->
            case get index board of
                Just (Empty pieceId highlight) ->
                    let inserted =
                            updateAroundTile index
                                <| set index
                                    (Filled pieceId (updateTile tile index board) highlight)
                                    board
                    in Ok <| updateScoreOnTileChange inserted index
                _ ->
                    Err <| CannotAddTileFieldNotEmpty index
        Nothing ->
            Err CannotInsertTileDrawPositionNothing

updateScoreOnTileChange : Board -> Index -> Board
updateScoreOnTileChange board (xIndex, yIndex) =
    let pieceId =
            case get (xIndex, yIndex) board of
                Just (Empty id _) -> Just id
                Just (Filled id _ _) -> Just id
                _ -> Nothing
        rowsAndCols = calculateColScore (calculateRowScore board yIndex) xIndex
        updateBoard id =
            { rowsAndCols | pieces =
                  List.Extra.updateIf ((==) id << .id) (calculatePieceScore board) board.pieces
            }
    in Maybe.withDefault rowsAndCols
        <| Maybe.map updateBoard pieceId

drawTile : Index -> Int -> Tile -> Highlight -> Svg.Svg Msg
drawTile (xIndex, yIndex) pieceId tile highlight =
    Svg.svg
        [ Svga.viewBox "0 0 50 50"
        , Svga.x <| String.fromInt (xIndex * 52 + 2)
        , Svga.y <| String.fromInt (yIndex * 52 + 2)
        , Svga.width "50"
        , Svga.height "50"
        , Events.onMouseEnter <| DragOverField (xIndex, yIndex)
        , Events.onMouseLeave DragLeave
        , Events.onMouseDown <| DragFromBoardStart (xIndex,yIndex) 
        ] <|
        [ Svg.rect
          [ Svga.x "0"
          , Svga.y "0"
          , Svga.width "50"
          , Svga.height "50"
          , Svga.fill <| colorToString tile.color
          ] [] 
        , Svg.text_
                    [ Svga.fill "black"
                    , Svga.x "25"
                    , Svga.y "25"
                    , Svga.textAnchor "middle"
                    , Svga.dominantBaseline "central"
                    , Svga.style "font-size: 1.5em"
                    , Svga.class "noselect"
                    ]
                    [ Svg.text <| String.fromInt tile.currentValue
                    ]
        ] ++ drawHighlight highlight
