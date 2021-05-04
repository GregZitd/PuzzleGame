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

type Drag
    = DragPieceFromHand Piece Int
    | DragTileFromHand Tile Int
    | DragPieceFromBoard Piece 
    | DragTileFromBoard Tile 
    | None

mapDragPiece : (Piece -> Piece) -> Drag -> Drag
mapDragPiece f drag =
    case drag of
        DragPieceFromHand piece id ->
            DragPieceFromHand (f piece) id
        DragPieceFromBoard piece ->
            DragPieceFromBoard (f piece)
        _ -> drag

mapDragTile : (Tile -> Tile) -> Drag -> Drag
mapDragTile f drag =
    case drag of
        DragTileFromHand tile id ->
            DragTileFromHand (f tile) id
        DragTileFromBoard tile ->
            DragTileFromBoard (f tile)
        _ -> drag

rotateDragRight : Drag -> Drag
rotateDragRight drag =
    mapDragTile rotateTileRight drag
        |> mapDragPiece rotatePieceRight

rotateDragLeft : Drag -> Drag
rotateDragLeft drag =
    mapDragTile rotateTileLeft drag
        |> mapDragPiece rotatePieceLeft

indexDrag : Maybe Index -> Drag -> Drag
indexDrag index drag =
    case drag of
        DragPieceFromHand piece id ->
            DragPieceFromHand (newDrawPosition index piece) id
        DragPieceFromBoard piece ->
            DragPieceFromBoard (newDrawPosition index piece)
        DragTileFromHand tile id ->
            DragTileFromHand { tile | drawPosition = index } id
        DragTileFromBoard tile ->
            DragTileFromBoard { tile | drawPosition = index } 
        None -> None

type Msg
    = DragFromHandStart Drag
    | DragFromBoardStart Index
    | DragOverField Index
    | DragLeave
    | DragDrop
                        
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
    , pieces : PieceDict
    , highlight : List Index 
    , rowReqs : ScoreDict
    , colReqs : ScoreDict
    }

type alias BoardTiles = Array (Array Field)

type alias ScoreDict = Dict Int (Score, Score)

--PIECE
    
type alias Piece =
    { shape : Shape
    , borderTransform : BorderTransform 
    , drawPosition : Maybe Index
    , positions : List Index
    , req : Score
    , score : Score
    }

type alias BorderTransform =
    { rotate : Int
    , translate : (Int, Int)
    }

mapTranslate : ((Int, Int) -> (Int, Int)) -> BorderTransform -> BorderTransform
mapTranslate f trans =
    { trans | translate = f trans.translate }

type Shape
    = Twoi (List Index)
    | Threel (List Index)
    | Threei (List Index)

type alias PieceDict = Dict Int Piece

newDrawPosition : Maybe Index -> Piece -> Piece
newDrawPosition mIndex piece =
    case mIndex of
        Just (x, y) ->
            let positions = 
                    List.map
                       (Tuple.mapBoth ((+) x) ((+) y))
                       (shapeToIndexes piece.shape)
            in { piece | drawPosition = mIndex, positions = positions }
        Nothing ->
            { piece | drawPosition = mIndex, positions = [] }

newShape : Shape -> Piece -> Piece
newShape shape piece =
    case piece.drawPosition of
        Just (posx, posy) ->
            let positions = 
                    List.map
                       (Tuple.mapBoth ((+) posx) ((+) posy))
                       (shapeToIndexes shape)
            in { piece | shape = shape, positions = positions }
        Nothing ->
            { piece | shape = shape }

addToPieceDict : Piece -> PieceDict -> (Int, PieceDict)
addToPieceDict piece dict =
    let keys = Dict.keys dict
        newKey =
            Maybe.withDefault 0
                <| List.head
                    << List.filter (\n -> not <| List.member n keys)
                    <| (List.range 0 <| List.length keys)
    in (newKey, Dict.insert newKey piece dict)

calculateIndexes : Piece -> Maybe (List Index)
calculateIndexes piece =
    Maybe.map
        (\(posx, posy) ->
             List.map
                (Tuple.mapBoth ((+) posx) ((+) posy))
                (shapeToIndexes piece.shape) )
        piece.drawPosition

shapeMap : ( List Index -> List Index) -> Shape -> Shape
shapeMap f shape =
    case shape of
        Twoi indexes -> Twoi <| f indexes
        Threel indexes -> Threel <| f indexes
        Threei indexes -> Threei <| f indexes

rotatePieceRight : Piece -> Piece
rotatePieceRight piece =
    let rotate (xIndex, yIndex) =
            ((-1) * yIndex, xIndex)
        transform = piece.borderTransform
        newTransform =
            mapTranslate
                (\(transx, transy) -> ((-1) * transy, transx))
                { transform | rotate = modBy 360 (transform.rotate + 90) }
    in newShape
        (shapeMap (List.map rotate) piece.shape)
        { piece | borderTransform = newTransform }
        
rotatePieceLeft : Piece -> Piece
rotatePieceLeft piece =
    let rotate (xIndex, yIndex) =
            (yIndex, (-1) * xIndex)
        transform = piece.borderTransform
        newTransform =
            mapTranslate
                (\(transx, transy) -> (transy, (-1) * transx))
                { transform | rotate = modBy 360 (transform.rotate - 90) }
    in newShape
        (shapeMap (List.map rotate) piece.shape)
        { piece | borderTransform = newTransform }

shapeToIndexes : Shape -> List Index
shapeToIndexes shape =
    case shape of
        Twoi indexes -> indexes
        Threel indexes -> indexes
        Threei indexes -> indexes

drawPieceTooltip : Piece -> Html msg
drawPieceTooltip piece =
    div 
        [ Attributes.style "background-color" "yellow"
        , Attributes.style "font-size" "1.4rem"
        , Attributes.style "width" "max-content"
        ] 
        [ drawPieceReq piece
        ]

drawPieceReq : Piece -> Html msg
drawPieceReq piece =
    div []  
         [ div [] <| List.concat ( List.map2 drawReq piece.score piece.req )
         ]

    -- if piece.minReq == [] then
    --     div [] [text "No bonuses"]
    -- else
    --     div []  
    --          [ div [] <| List.concat ( List.map2 drawReq piece.score piece.minReq )
    --          , div [] <| List.concat ( List.map2 drawReq piece.score piece.maxReq )
    --          ]

drawReq : (Color, Int) -> (Color, Int) -> List (Html msg)
drawReq (pointC, pointI) (reqC, reqI) =
    if reqI == 0 then []
    else
        [ div [ Attributes.style "display" "inline-block"]
              [ text <| String.fromInt reqI ++ "/" ++ String.fromInt pointI
              , drawColorCircle pointC
              ]
        ]
       
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
        DragPieceFromHand piece _ ->
            highlightPiece board piece
        DragPieceFromBoard piece ->
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
        (newId, newDict) = addToPieceDict piece board.pieces
    in if canAdd then
           if piece.drawPosition == Nothing then
               Err CannotInsertPieceDrawPositionNothing
           else
               Ok <| List.foldr
                        (\ind brd -> { brd | tiles = .tiles <| set ind (Empty newId False) brd } )
                        { board | pieces = newDict}
                        piece.positions
       else
           Err CannotAddPieceFieldIsOccupied
       
drawPieceIcon : Bool -> (Int, Piece) -> Html Msg
drawPieceIcon showTooltip (id, piece) =
    let vbtopx = Maybe.withDefault 0
                 <| List.minimum
                 <| List.map Tuple.first (shapeToIndexes piece.shape)
        vbtopy = Maybe.withDefault 0
                 <| List.minimum
                 <| List.map Tuple.second (shapeToIndexes piece.shape)
        vbwidth = (Maybe.withDefault 0
                    <| List.maximum
                    <| List.map Tuple.first (shapeToIndexes piece.shape)
                  ) - vbtopx
        vbheight = (Maybe.withDefault 0
                    <| List.maximum
                    <| List.map Tuple.second (shapeToIndexes piece.shape)
                   ) - vbtopy
    in 
            div
                [ Attributes.style "display" "inline-block"
                , Attributes.class <| if showTooltip then "tile" else ""
                , Events.onMouseDown <| DragFromHandStart (DragPieceFromHand piece id)
                ]
                [ Svg.svg
                      [ Svga.viewBox <| 
                            String.fromInt (52 * vbtopx) ++ " " ++
                            String.fromInt (52 * vbtopy) ++ " " ++
                            String.fromInt (52 * vbwidth + 54) ++ " " ++
                            String.fromInt (52 * vbheight + 54)
                      , Svga.width <| String.fromInt (vbwidth * 2 + 2) ++ "em"
                      , Svga.height <| String.fromInt (vbheight * 2 + 2) ++ "em"
                          
                      , Svga.style "margin-bottom: -4px"
                      ] <|
                      [ drawPieceBorder piece ] ++
                          List.map (\(x,y) -> drawRect x y) (shapeToIndexes piece.shape)
                , div [ Attributes.class "tooltip" ] [ drawPieceTooltip piece ]
                ]
    
drawRect : Int -> Int -> Svg.Svg msg
drawRect x y =
    Svg.rect
        [ Svga.x <| String.fromInt (52 * x + 2)
        , Svga.y <| String.fromInt (52 * y + 2)
        , Svga.width "50"
        , Svga.height "50"
        , Svga.fill "#ddb892"
        ] []

drawPieceBorder : Piece -> Svg.Svg msg
drawPieceBorder piece =
    let rotate = piece.borderTransform.rotate
        (transx, transy) = piece.borderTransform.translate
        drawPath (startingX, startingY) path =
                    Svg.path
                        [ Svga.d <| "M " ++ String.fromInt (startingX * 52 + 1) ++ " " ++
                              String.fromInt (startingY * 52 + 1) ++ path
                        , Svga.strokeWidth "2"
                        , Svga.stroke "black"
                        , Svga.fill "none"
                        , Svga.transform <|
                            "translate(" ++
                            String.fromInt transx ++ ", " ++
                            String.fromInt transy ++ ")" ++
                            "rotate(" ++ String.fromInt rotate ++ "," ++
                            String.fromInt (startingX * 52 + 27) ++ "," ++
                            String.fromInt (startingY * 52 + 27) ++ ")"
                        ]
                         []
        draw cord =
            case piece.shape of
                Twoi _ ->
                    drawPath cord " h 52 v 104 h -52 v -105"
                Threel _ ->
                    drawPath cord " v 52 h 104 v -52 h -52 v -52 h -52 v 52"
                Threei _ ->
                    drawPath cord " v 104 h 52 v -156 h -52 v 52"
    in case piece.drawPosition of
           Just pos -> draw pos
           Nothing -> draw (0,0)

--BOARD
        

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
    case Dict.get id board.pieces of
        Just piece ->
            if checkIfPieceEmpty piece board then
                let updatedPieces =
                        Dict.remove id board.pieces
                in Ok <| ( List.foldr
                             (\index brd -> set index (NonTile False) brd)
                             { board | pieces = updatedPieces }
                             piece.positions
                         , piece
                         )
            else Err <| PieceToRemoveIsNotEmpty id
                                
        Nothing ->
            Err <| NoPieceOnBoardWithId id

translatePiece : Index -> Piece -> Piece
translatePiece (indx, indy) piece =
    case piece.drawPosition of
        Just (dpx, dpy) ->
            let (transx, transy) = (dpx - indx, dpy - indy)
                newTransform = 
                    mapTranslate
                        (\(trx, try) -> (trx + 52 * transx, try + 52 * transy))
                        piece.borderTransform
            in newShape
                     (shapeMap (List.map <| Tuple.mapBoth ((+) transx) ((+) transy)) piece.shape)
                     { piece | borderTransform = newTransform }
        Nothing ->
            piece
    
insertDrag : Board -> Drag -> Result BoardErr Board
insertDrag board drag =
    case drag of
        DragPieceFromHand piece _ ->
            insertPiece piece board
        DragPieceFromBoard piece ->
            insertPiece piece board
        DragTileFromHand tile id ->
            insertTile tile board
        DragTileFromBoard tile ->
            insertTile tile board
        None -> Ok board
                     
drawBoard : Board -> Html Msg
drawBoard board =
   Svg.svg
       [ Svga.viewBox "0 0 210 210"
       ] <|
       (List.map drawPieceBorder (Dict.values board.pieces)) ++
       (List.concat << toList) (indexedMap drawField board.tiles) 

--SCORE

type alias Score = List (Color, Int)

emptyScore : Score
emptyScore =
    [ (Purple, 0) , (Green, 0) , (Yellow, 0) , (Orange, 0) ]

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

isScoreLower : Score -> Score -> Bool
isScoreLower score req =
    List.map2 (<)
        (List.map Tuple.second score)
        (List.map Tuple.second req)
        |> List.all (\a -> a)

isScoreHigher : Score -> Score -> Bool
isScoreHigher score req =
    List.map2 (>)
        (List.map Tuple.second score)
        (List.map Tuple.second req)
        |> List.all (\a -> a) 

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

--TILE

type alias Tile =
    { color : Color
    , baseValue : Int
    , currentValue : Int
    , prodBonus : Float
    , addBonus : Int
    , properties : List Property
    , drawPosition : Maybe Index
    }

type alias Property =
    { region : List Index
    , reqColor : Color
    , reqValue : Int
    , prodBonus : Float
    , addBonus : Int
    , isMet : Bool
    }

rotatePropertyRight : Property -> Property
rotatePropertyRight property =
    let rotate (xIndex, yIndex) =
            ((-1) * yIndex, xIndex)
    in { property | region = List.map rotate property.region }

rotatePropertyLeft : Property -> Property
rotatePropertyLeft property =
    let rotate (xIndex, yIndex) =
            (yIndex, (-1) * xIndex)
    in { property | region = List.map rotate property.region }

rotateTileRight : Tile -> Tile
rotateTileRight tile =
    { tile | properties = List.map rotatePropertyRight tile.properties }

rotateTileLeft : Tile -> Tile
rotateTileLeft tile =
    { tile | properties = List.map rotatePropertyLeft tile.properties }

type alias Index = (Int, Int)

type Color
    = Purple --684551
    | Green --008148
    | Yellow --fed766
    | Orange --f4743b
    -- = Purple --5f0f4f
    -- | Red --9a031e
    -- | Yellow --fb8b24
    -- | Orange --e36414
    -- | Blue --0f4c5c

type alias TileDict = Dict Int Tile

addToTileDict : Tile -> TileDict -> TileDict
addToTileDict tile dict =
    let keys = Dict.keys dict
        newKey =
            Maybe.withDefault 0
                <| List.head
                    << List.filter (\n -> not <| List.member n keys)
                    <| (List.range 0 <| List.length keys)
    in Dict.insert newKey { tile | drawPosition = Nothing } dict

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
                  floor (toFloat tile.baseValue * (prodBonus + 1)) + addBonus
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
                  Dict.update id
                      (Maybe.map <| calculatePieceScore board)
                  board.pieces
            }
    in Maybe.withDefault rowsAndCols
        <| Maybe.map updateBoard pieceId
colorToString : Color -> String
colorToString color =
    case color of
        Purple -> "#5f0f4f"-- "#684551"
        Green -> "#008148"
        Yellow -> "#fed766"
        Orange -> "#f4743b"
            
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

drawTileIcon : Bool -> (Int, Tile) -> Html Msg
drawTileIcon showTooltip (id, tile) =
    div [ Attributes.style "display" "inline-block"
        , Attributes.class <| if showTooltip then "tile" else ""
        , Events.onMouseDown <| DragFromHandStart (DragTileFromHand tile id)
        ] <| 
        [ drawTileIconSvg tile
        , div [ Attributes.class "tooltip" ] [ drawTileTooltip tile ]
        ]

drawTileTooltip : Tile -> Html msg
drawTileTooltip tile =
    div 
        [ Attributes.style "background-color" "yellow"
        , Attributes.style "font-size" "1.4rem"
        , Attributes.style "width" "max-content"
        ] <| if List.isEmpty tile.properties then [p [] [text "No properties"]] else
        List.map
              (\pr ->
                   p [] <|
                       ( if tile.drawPosition == Nothing then []
                         else [ drawReqMet pr.isMet ] ) ++
                       [ text <| String.fromInt pr.reqValue ++ " "
                       , drawRegion pr.region pr.reqColor
                       , text <| " " ++ String.fromFloat pr.prodBonus ++ "x + " ++ String.fromInt pr.addBonus
                       ]
              )
              tile.properties

drawTileIconSvg : Tile -> Svg.Svg msg
drawTileIconSvg tile =
    Svg.svg
        [ Svga.viewBox "0 0 50 50"
        , Svga.x "0"
        , Svga.y "0"
        , Svga.width "50"
        , Svga.height "50"
        , Attributes.attribute "xmlns" "http://www.w3.org/2000/svg"
        ]
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
            [ Svg.text <| String.fromInt tile.baseValue ]
        ]


drawRegion : List (Int, Int) -> Color -> Html msg
drawRegion region color =
    Svg.svg
        [ Svga.viewBox "0 0 30 30"
        , Svga.style "height: 1.2em"
        ] <|
        [ Svg.rect
              [ Svga.x "0"
              , Svga.y "0"
              , Svga.width "30"
              , Svga.height "30"
              , Svga.fill "grey"
              ] []
        , Svg.rect
              [ Svga.x "10"
              , Svga.y "10"
              , Svga.width "10"
              , Svga.height "10"
              , Svga.fill "black"
              ] []
        ] ++
        ( List.map
              (\ (x,y) ->
                   Svg.rect
                       [ Svga.x <| String.fromInt (10 * x + 10)
                       , Svga.y <| String.fromInt (10 * y + 10)
                       , Svga.width "10"
                       , Svga.height "10"
                       , Svga.fill <| colorToString color
                       ] []
              )
              region
        )
        
drawReqMet : Bool -> Svg.Svg msg
drawReqMet isMet =
    Svg.svg
        [ Svga.viewBox "0 0 30 30"
        , Svga.style "height: 0.8em"
        ] <|
        if isMet then
            [ Svg.path
                  [ Svga.d "M 6 19 L 14 24 L 26 4"
                  , Svga.strokeWidth "8"
                  , Svga.stroke "green"
                  , Svga.fill "none"
                  ] []
            ]
        else 
            [ Svg.path
                  [ Svga.d "M 4 4 L 26 26 M 4 26 L 26 4"
                  , Svga.strokeWidth "8"
                  , Svga.stroke "red"
                  ] []
            ]

drawColorCircle : Color -> Svg.Svg msg
drawColorCircle color =
    Svg.svg
        [ Svga.viewBox "0 0 30 30"
        , Svga.style "height: 1.2em"
        ]
        [ Svg.circle
              [ Svga.cx "15"
              , Svga.cy "15"
              , Svga.r "14"
              , Svga.fill <| colorToString color
              ] []
        ]
              
