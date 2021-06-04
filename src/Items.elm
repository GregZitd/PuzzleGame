module Items exposing (..)

import Html exposing (..)
import Html.Attributes as Attributes
import Html.Events as Events
import Svg
import Svg.Attributes as Svga


type alias Index = (Int, Int)


type Color
    = Purple --684551
    | Green --008148
    | Yellow --fed766
    | Orange --f4743b

colors : List Color
colors = [ Purple, Green, Yellow, Orange ]

type alias Score = List (Color, Int)

emptyScore : Score
emptyScore =
    [ (Purple, 0) , (Green, 0) , (Yellow, 0) , (Orange, 0) ]

addScores : Score -> Score -> Score
addScores sc1 sc2 =
    List.map2 (\(c1,v1) (_,v2) -> (c1, v1 + v2)) sc1 sc2
    
type Scroll
    = Modification
    | Augmentation
    | Alteration
    | Distillation

type alias Reward =
    { tiles : List Tile
    , scrolls : List (Scroll, Int)
    , orbs : Score
    , essences : List Essence
    }

--DRAG

type Drag
    = DragPiece Piece 
    | DragTile Tile 
    | DragEssence Essence
    | None
                
type Msg
    = DragFromHandStart Drag
    | DragFromBoardStart Index
    | DragFromBenchStart Drag
    | DragOverField Index
    | DragLeave
    | DragDrop

rotateDragRight : Drag -> Drag
rotateDragRight drag =
    case drag of
        DragPiece piece ->
            DragPiece <| rotatePieceRight piece
        DragTile tile ->
            DragTile <| rotateTileRight tile
        DragEssence essence ->
            DragEssence <| rotateEssenceRight essence
        None -> None
    
rotateDragLeft : Drag -> Drag
rotateDragLeft drag =
    case drag of
        DragPiece piece ->
            DragPiece <| rotatePieceLeft piece
        DragTile tile ->
            DragTile <| rotateTileLeft tile
        DragEssence essence ->
            DragEssence <| rotateEssenceLeft essence
        None -> None

indexDrag : Maybe Index -> Drag -> Drag
indexDrag index drag =
    case drag of
        DragPiece piece ->
            DragPiece (newDrawPosition index piece)
        DragTile tile ->
            DragTile { tile | drawPosition = index } 
        DragEssence essence ->
            DragEssence essence
        None -> None

getDragId : Drag -> Int
getDragId drag =
    case drag of
        DragPiece piece -> piece.id
        DragTile tile -> tile.id
        DragEssence essence -> essence.id
        None -> -1
    
--PIECE
    
type alias Piece =
    { shape : Shape
    , borderTransform : BorderTransform 
    , drawPosition : Maybe Index
    , positions : List Index
    , req : Score
    , score : Score
    , id : Int
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
    | Fouro (List Index)
    | Fourt (List Index)
    | Fours (List Index)
    | Fourz (List Index)
    | Fourl (List Index)
    | Fourr (List Index)

twoiStartIndex : List Index
twoiStartIndex = [(0,0), (0,1)]

threelStartIndex : List Index
threelStartIndex = [(0,0), (0,-1), (1,0)]

threeiStartIndex : List Index
threeiStartIndex = [(0,0), (0,1), (0,-1)]

fouroStartIndex : List Index
fouroStartIndex = [(0,0), (1,0), (0, 1), (1,1)]

fourtStartIndex : List Index
fourtStartIndex = [(0,0), (-1,0), (1,0), (0,1)]

foursStartIndex : List Index
foursStartIndex = [(0,0), (1,0), (0,1), (-1, 1)]

fourzStartIndex : List Index
fourzStartIndex = [(0,0), (-1,0), (0,1), (1,1)]

fourlStartIndex : List Index
fourlStartIndex = [(0,0), (0,-1), (0,1), (1,1)]

fourrStartIndex : List Index
fourrStartIndex = [(0,0), (0,1), (0,-1), (1,-1)]

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
        Fouro indexes -> Fouro <| f indexes
        Fourt indexes -> Fourt <| f indexes
        Fours indexes -> Fours <| f indexes
        Fourz indexes -> Fourz <| f indexes
        Fourl indexes -> Fourl <| f indexes
        Fourr indexes -> Fourr <| f indexes

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
        Fouro indexes -> indexes
        Fourt indexes -> indexes
        Fours indexes -> indexes
        Fourz indexes -> indexes
        Fourl indexes -> indexes
        Fourr indexes -> indexes

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

drawReq : (Color, Int) -> (Color, Int) -> List (Html msg)
drawReq (pointC, pointI) (reqC, reqI) =
    if reqI == 0 then []
    else
        [ div [ Attributes.style "display" "inline-block"]
              [ text <| String.fromInt reqI ++ "/" ++ String.fromInt pointI
              , drawColorCircle pointC
              ]
        ]
drawPieceIcon : Bool -> Piece -> Html Msg
drawPieceIcon showTooltip piece =
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
                , Events.onMouseDown <| DragFromHandStart (DragPiece piece) 
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
                Fouro _ ->
                    drawPath cord " h 104 v 104 h -104 v -105"
                Fourt _ ->
                    drawPath cord " h 104 v 52 h -52 v 52 h -52 v -52 h -52 v -52 h 52"
                Fours _ ->
                    drawPath cord " h 104 v 52 h -52 v 52 h -104 v -52 h 52 v -53"
                Fourz _ ->
                    drawPath cord " h 52 v 52 h 52 v 52 h -104 v -52 h -52 v -52 h 52"
                Fourl _ ->
                    drawPath cord " v 104 h 104 v -52 h -52 v -104 h -52 v 52"
                Fourr _ ->
                    drawPath cord " v 104 h 52 v -104 h 52 v -52 h -104 v 52"
    in case piece.drawPosition of
           Just pos -> draw pos
           Nothing -> draw (0,0)

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
 


--TILE

type alias Tile =
    { color : Color
    , baseValue : Int
    , currentValue : Int
    , prodBonus : Float
    , addBonus : Float
    , properties : List Property
    , drawPosition : Maybe Index
    , id : Int
    }

rotateTileRight : Tile -> Tile
rotateTileRight tile =
    { tile | properties = List.map rotatePropertyRight tile.properties }

rotateTileLeft : Tile -> Tile
rotateTileLeft tile =
    { tile | properties = List.map rotatePropertyLeft tile.properties }

colorToString : Color -> String
colorToString color =
    case color of
        Purple -> "#5f0f4f"-- "#684551"
        Green -> "#008148"
        Yellow -> "#fed766"
        Orange -> "#f4743b"
            
drawTileIcon : Bool -> Tile -> Html Msg
drawTileIcon showTooltip tile =
    div [ Attributes.style "display" "inline-block"
        , Attributes.class <| if showTooltip then "tile" else ""
        , Events.onMouseDown <| DragFromHandStart (DragTile tile)
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
        ] <|
        [ p [] [ text <| "Base value: " ++ String.fromInt tile.baseValue ] ] ++
            List.map
                  (\pr -> drawProperty (tile.drawPosition /= Nothing) pr)
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

--ESSENCE              

type alias Essence =
    { id : Int
    , property : Property
    }

rotateEssenceRight : Essence -> Essence
rotateEssenceRight essence =
    { essence | property = rotatePropertyRight essence.property }

rotateEssenceLeft : Essence -> Essence
rotateEssenceLeft essence =
    { essence | property = rotatePropertyLeft essence.property }

drawEssence : (Drag -> Msg) -> Essence -> Html Msg
drawEssence dragMsg essence =
    div [ Attributes.class "tile"
        , Events.onMouseDown <| dragMsg (DragEssence essence)
        ]
        <| drawEssenceIcon essence

drawEssenceIcon : Essence -> List (Html msg)
drawEssenceIcon essence =
        [ Svg.svg
            [ Svga.viewBox "0 0 50 50"
            , Svga.x "0"
            , Svga.y "0"
            , Svga.width "50"
            , Svga.height "50"
            ]
            [ Svg.text_
                [ Svga.fill "black"
                , Svga.x "25"
                , Svga.y "25"
                , Svga.textAnchor "middle"
                , Svga.dominantBaseline "central"
                , Svga.style "font-size: 1.5em"
                , Svga.class "noselect"
                , Svga.fill <| colorToString essence.property.reqColor
                ]
                [ Svg.text "E" ]
            ]
        , div 
            [ Attributes.style "background-color" "yellow"
            , Attributes.style "font-size" "1.4rem"
            , Attributes.style "width" "max-content"
            , Attributes.class "tooltip"
            ]
            [ drawProperty False essence.property
            ]
        ]

--PROPERTY

type alias Property =
    { region : List Index
    , reqColor : Color
    , reqValue : Int
    , prodBonus : Float
    , addBonus : Float
    , isMet : Bool
    }

prop2OpEdge : List Index
prop2OpEdge = [(0,-1), (0,1)]

prop2OpCorn : List Index
prop2OpCorn = [(1,-1), (-1,1)]

prop2Corn1 : List Index
prop2Corn1 = [(1,0), (1,-1)]

prop2Corn2 : List Index
prop2Corn2 = [(0,-1), (1,-1)]

prop3Corn : List Index
prop3Corn = [(0,-1), (1,-1), (1,0)]

prop3Edge : List Index
prop3Edge = [(1,-1), (1,0), (1,1)]

prop4Edge : List Index
prop4Edge = [(-1,0), (0,-1), (1,0), (0,1)]

prop4Corn : List Index
prop4Corn = [(-1,-1), (1,-1), (1,1), (-1,1)]

prop4Double1 : List Index
prop4Double1 = [(-1,0), (-1,1), (1,0), (1,-1)]

prop4Double2 : List Index
prop4Double2 = [(-1,0), (-1,-1), (1,0), (1,1)]

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

drawProperty : Bool -> Property -> Html msg
drawProperty showReqMet pr =
    p [] <|
        ( if not showReqMet then []
          else [ drawReqMet pr.isMet ] ) ++
        [ text <| String.fromInt pr.reqValue ++ " "
        , drawRegion pr.region pr.reqColor
        , text <| " " ++ String.fromFloat pr.prodBonus ++ "x + " ++ String.fromFloat pr.addBonus
        ]
