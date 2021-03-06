module Main exposing (..)

import Browser
import Browser.Events
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as Events
import Array exposing (Array)
import Random
import Dict exposing (Dict)
import Svg
import Svg.Attributes as Svga
import Svg.Events as Svge
import Json.Decode as Decode

import Board
import Demo

-- MAIN


main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }


-- MODEL


type alias Model =
    { board: Board.Board
    , pieces : Board.PieceDict
    , tiles : Board.TileDict
    , dragedItem : Board.Drag
    , mousePos : (Int, Int)
    , hoveredTile : Maybe Board.Tile
    , hoveredPiece : Maybe Board.Piece
    , showTileTooltip : Bool
    }

init : () -> (Model, Cmd Msg)
init _ =
  ({ board = Demo.initBoard
   , pieces = Demo.initPieces
   , tiles = Demo.initTiles
   , dragedItem = Board.None
   , mousePos = (0,0)
   , hoveredTile = Nothing
   , hoveredPiece = Nothing
   , showTileTooltip = False
   }
  , Cmd.none )

-- UPDATE


type Msg
    = DragMsg Board.Msg
    | KeyboardMsg KeyDownInput
    | KeyboardUpMsg KeyUpInput
    | MousePosition Int Int

updateDrag : Board.Drag -> Model -> Model
updateDrag drag model =
    { model
          | dragedItem = drag
          , board = Board.highlightBoard model.board drag
    }

updateHover : Model -> Model
updateHover model =
    case model.dragedItem of
        Board.DragPieceFromHand piece _ ->
            { model | hoveredPiece = Just piece }
        Board.DragPieceFromBoard piece -> 
            { model | hoveredPiece = Just piece }
        Board.DragTileFromHand tile _ -> 
            { model | hoveredTile = Just tile }
        Board.DragTileFromBoard tile -> 
            { model | hoveredTile = Just tile }
        _ ->
            model

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
      DragMsg dragMsg ->
          case dragMsg of
              Board.DragFromHandStart drag ->
                  ( { model | dragedItem = drag }, Cmd.none )

              Board.DragFromBoardStart index ->
                  case Board.get index model.board of
                      Just (Board.Empty pieceId _) ->
                          case Board.removePiece model.board pieceId of
                                 Ok (board, piece) ->
                                     ( updateDrag
                                           (Board.DragPieceFromBoard
                                                 <| Board.newDrawPosition
                                                     (Just index)
                                                     (Board.translatePiece index piece))
                                           { model | board = board, hoveredPiece = Nothing }
                                     , Cmd.none
                                     )
                                 Err err ->
                                    (model, Cmd.none)
                      Just (Board.Filled _ tile _) ->
                          ( { model
                                  | dragedItem = Board.DragTileFromBoard tile
                                  , board = Board.removeTile index model.board
                                  , hoveredTile = Nothing
                            }, Cmd.none
                          )
                      _ ->
                         (model, Cmd.none)

              Board.DragOverField index ->
                  let indexedDrag = Board.indexDrag (Just index) model.dragedItem
                  in case Board.get index model.board of
                         Just (Board.Filled pieceId tile _) ->
                             ( updateDrag indexedDrag
                                   { model | hoveredTile = Just tile
                                           , hoveredPiece = Dict.get pieceId model.board.pieces
                                   }, Cmd.none
                             )
                         Just (Board.Empty pieceId _) ->
                             ( updateDrag indexedDrag
                                   { model | hoveredPiece = Dict.get pieceId model.board.pieces }
                             , Cmd.none )
                         _ -> 
                             ( updateDrag indexedDrag model, Cmd.none )
                             
              Board.DragLeave ->
                  ( { model
                          | board = Board.removeHighlight model.board
                          , hoveredTile = Nothing
                          , hoveredPiece = Nothing
                          , dragedItem = Board.indexDrag Nothing model.dragedItem
                    }
                  , Cmd.none
                  )

              Board.DragDrop ->
                  case Board.insertDrag model.board model.dragedItem of
                      Ok board ->
                          dragEnd True <| updateHover { model | board = board }
                      Err _ ->
                         dragEnd False model 

      KeyboardMsg key ->
          case key of
              RotateRight ->
                  let rotatedDrag = Board.rotateDragRight model.dragedItem
                  in ( { model
                             | dragedItem = rotatedDrag
                             , board = Board.highlightBoard
                                       (Board.removeHighlight model.board) rotatedDrag
                       }, Cmd.none
                     )
                  
              RotateLeft ->
                  let rotatedDrag = Board.rotateDragLeft model.dragedItem
                  in ( { model
                             | dragedItem = rotatedDrag
                             , board = Board.highlightBoard
                                       (Board.removeHighlight model.board) rotatedDrag
                       }, Cmd.none
                     )
                 
              ShiftDown ->
                  ( { model | showTileTooltip = True }, Cmd.none )

              _ -> 
                  ( model, Cmd.none)

      KeyboardUpMsg key ->
          case key of
              ShiftUp ->
                  ( { model | showTileTooltip = False }, Cmd.none )
              _ ->
                  ( model, Cmd.none )

      MousePosition x y ->
         ( { model | mousePos = (x,y) }, Cmd.none )

dragEnd : Bool -> Model -> (Model, Cmd Msg)
dragEnd success model =
    let removedFromHand =
            if success then 
                case model.dragedItem of
                    Board.DragTileFromHand _ id ->
                        { model | tiles = Dict.remove id model.tiles }
                    Board.DragPieceFromHand _ id ->
                        { model | pieces = Dict.remove id model.pieces }
                    _ -> model
            else case model.dragedItem of
                     Board.DragPieceFromBoard piece ->
                         { model | pieces = Tuple.second <|
                               Board.addToPieceDict piece model.pieces }
                     Board.DragTileFromBoard tile ->
                         { model | tiles = Board.addToTileDict tile model.tiles }
                     Board.DragPieceFromHand piece pieceId ->
                         { model | pieces = Dict.update pieceId (\_ -> Just piece) model.pieces }
                     Board.DragTileFromHand tile tileId ->
                         { model | tiles = Dict.update tileId (\_ -> Just tile) model.tiles }
                     _ -> model
    in ({ removedFromHand | dragedItem = Board.None, board = Board.removeHighlight model.board}
       , Cmd.none)
      
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    if (model.hoveredTile /= Nothing || model.hoveredPiece /= Nothing) && model.showTileTooltip then
        Sub.batch
        [ Browser.Events.onKeyDown keyDecoder
        , Browser.Events.onKeyUp keyUpDecoder
        , Browser.Events.onMouseMove mouseDecoder
        ]
    else
        Sub.batch
        [ Browser.Events.onKeyDown keyDecoder
        , Browser.Events.onKeyUp keyUpDecoder
        ]

type KeyDownInput
    = RotateRight
    | RotateLeft
    | ShiftDown
    | InvalidKey

type KeyUpInput
    = ShiftUp
    | InvalidUpKey

keyDecoder : Decode.Decoder Msg
keyDecoder =
    Decode.map toKey (Decode.field "key" Decode.string)

keyUpDecoder : Decode.Decoder Msg
keyUpDecoder =
    Decode.map toUpKey (Decode.field "key" Decode.string)
        
toKey : String -> Msg
toKey keyValue =
    case String.uncons keyValue of
        Just ('d', "") ->
            KeyboardMsg RotateRight
        Just ('a', "") ->
            KeyboardMsg RotateLeft
        Just ('S', "hift") ->
            KeyboardMsg ShiftDown
        _ ->
            KeyboardMsg InvalidKey

toUpKey : String -> Msg
toUpKey keyValue =
    case keyValue of
        "Shift" ->
            KeyboardUpMsg ShiftUp
        _ ->
            KeyboardUpMsg InvalidUpKey

mouseDecoder : Decode.Decoder Msg
mouseDecoder =
    Decode.map2
        MousePosition
        (Decode.field "pageX" Decode.int)
        (Decode.field "pageY" Decode.int)

-- VIEW

view : Model -> Html Msg
view model =
    div
        ( [ style "height" "100vh"
          , style "width" "99vw"
          , style "overflow" "hidden"
          , style "position" "relative"
          , style "padding-left" "1vw"
          ] ++
              if model.dragedItem == Board.None then []
              else [ Events.onMouseUp <| DragMsg Board.DragDrop ]
        ) <|
        [ div
              [ style "display" "grid"
              , style "grid-template-columns" "3fr 4fr"
              , style "grid-gap" "10px"
              , style "height" "100vh"
              , style "align-content" "center"
              ]
              [ viewLeftPane model
              , viewRightPane model
              ]
        ] ++ 
              if model.showTileTooltip then
                  [ div [ style "display" "block"
                        , style "left"
                            <| String.fromInt (Tuple.first model.mousePos + 10) ++ "px"
                        , style "top"
                            <| String.fromInt (Tuple.second model.mousePos + 10) ++ "px"
                        , style "position" "absolute"
                        ] <|
                        (Maybe.withDefault [] <|
                            Maybe.map (List.singleton << Board.drawTileTooltip) model.hoveredTile)
                        ++ (Maybe.withDefault [] <|
                                Maybe.map
                                    (List.singleton << Board.drawPieceTooltip)
                                    model.hoveredPiece)
                  ]
              else
                  []

viewLeftPane : Model -> Html Msg
viewLeftPane model =
    div
        [ style "border" "0.8em double black"
        , style "background-color" "white"
        , style "height" "95vh"
        ] 
        [ div [ style "height" "6.5em"
              , style "display" "flex"
              , style "align-items" "center"
              , style "gap" "5px"
              ]
            <| List.map
                (Html.map DragMsg << Board.drawPieceIcon (model.dragedItem == Board.None))
                (Dict.toList model.pieces)
        , div [style "display" "flex", style "gap" "5px"]
            <| List.map
                (Html.map DragMsg << Board.drawTileIcon (model.dragedItem == Board.None))
                (Dict.toList model.tiles)
        ]

viewRightPane : Model -> Html Msg
viewRightPane model =
    div [ style "justify-self" "center"
        , style "align-self" "center"
        , style "display" "grid"
        , style "grid-template-columns" "1fr 2fr 2fr 2fr 2fr"
        , style "grid-template-rows" "2fr 2fr 2fr 2fr 2fr"
        , style "grid-gap" "0.38vw"
        , style "justify-items" "center"
        , style "align-items" "center"
        , style "width" "45vw"
        , style "height" "50vw"
        ] <|
        [ div
              [ style "width" "40vw"
              , style "grid-row" "2 / 6"
              , style "grid-column" "2 / 6"
              ]
              [ Html.map DragMsg <| Board.drawBoard model.board ]
        ] ++
        (List.map (Board.drawRowReq model.board) [0,1,2,3]) ++
        (List.map (Board.drawColReq model.board) [0,1,2,3])

        
