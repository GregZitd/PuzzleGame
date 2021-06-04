module Main exposing (..)

import Browser
import Browser.Events
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as Events
import Array exposing (Array)
import Dict exposing (Dict)
import Svg
import Svg.Attributes as Svga
import Svg.Events as Svge
import Json.Decode as Decode
import Random
import List.Extra

import Board
import Items
import ProcGen
import Crafting


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
    , pieces : List Items.Piece
    , tiles : List Items.Tile
    , essences : List Items.Essence
    , dragedItem : Items.Drag
    , mousePos : (Int, Int)
    , hoveredTile : Maybe Items.Tile
    , hoveredPiece : Maybe Items.Piece
    , showTileTooltip : Bool
    , craftingTable : Crafting.TableState
    , allReqMet : Bool
    , procGenState : ProcGen.State
    , rewards : Maybe Items.Reward
    , selectedReward : Maybe Items.Tile
    }

init : () -> (Model, Cmd Msg)
init _ =
  ({ board = noBoard
   , pieces = []
   , tiles = []
   , essences = []
   , dragedItem = Items.None
   , mousePos = (0,0)
   , hoveredTile = Nothing
   , hoveredPiece = Nothing
   , showTileTooltip = False
   , craftingTable = Crafting.init
   , allReqMet = False
   , procGenState = ProcGen.init
   , rewards = Nothing
   , selectedReward = Nothing
   }
  , Cmd.batch [ Random.generate NewBoard (ProcGen.generateBoard ProcGen.init.level)
              , Random.generate NewPieceList <| ProcGen.generatePieceList ProcGen.init
              , Random.generate NewTileList <| ProcGen.generateTileList 12 ProcGen.init
              --for testing
              -- , Random.generate RewardsGenerated
              --     <| ProcGen.generateReward
              --         (List.map (Tuple.mapSecond ((+) 30)) Items.emptyScore) ProcGen.init
              ])
 
noBoard =
    { tiles = Array.empty
    , pieces = []
    , highlight = []
    , rowReqs = Dict.empty 
    , colReqs = Dict.empty 
    }

-- UPDATE


type Msg
    = DragMsg Items.Msg
    | KeyboardMsg KeyDownInput
    | KeyboardUpMsg KeyUpInput
    | MousePosition Int Int
    | NewBoard Board.Board
    | NewPieceList (ProcGen.State, List Items.Piece)
    | NewTileList (ProcGen.State, List Items.Tile)
    | CraftingMsg Crafting.Msg
    | NextLevel
    | RewardsGenerated (ProcGen.State, Items.Reward)
    | RewardSelected Items.Tile
    | RewardConfirmed

updateDrag : Items.Drag -> Model -> Model
updateDrag drag model =
    { model
          | dragedItem = drag
          , board = Board.highlightBoard model.board drag
    }

removeDragFromHand : Items.Drag -> Model -> Model
removeDragFromHand drag model =
    case drag of
        Items.DragTile tile ->
            { model | tiles = List.filter ((/=) (Items.getDragId drag) << .id) model.tiles }
        Items.DragPiece piece ->
            { model | pieces = List.filter ((/=) (Items.getDragId drag) << .id) model.pieces }
        Items.DragEssence essence ->
            { model | essences = List.filter ((/=) (Items.getDragId drag) << .id) model.essences }
        Items.None ->
            model

updateHover : Model -> Model
updateHover model =
    case model.dragedItem of
        Items.DragPiece piece -> 
            { model | hoveredPiece = Just piece }
        Items.DragTile tile -> 
            { model | hoveredTile = Just tile }
        _ ->
            model

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
      DragMsg dragMsg ->
          handleDragMsg dragMsg model
              
      KeyboardMsg key ->
          case key of
              RotateRight ->
                  let rotatedDrag = Items.rotateDragRight model.dragedItem
                  in ( { model
                             | dragedItem = rotatedDrag
                             , board = Board.highlightBoard
                                       (Board.removeHighlight model.board) rotatedDrag
                       }, Cmd.none
                     )
                  
              RotateLeft ->
                  let rotatedDrag = Items.rotateDragLeft model.dragedItem
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

      NewBoard board ->
          ( { model | board = board }, Cmd.none )

      NewPieceList (newState, pieceList) ->
          ( { model | pieces = pieceList, procGenState = newState }, Cmd.none)

      NewTileList (newState, tileList) ->
          ( { model | tiles = tileList, procGenState = newState }, Cmd.none )

      CraftingMsg craftingMsg -> 
          Crafting.update craftingMsg model
              |> Tuple.mapSecond (Cmd.map CraftingMsg)

      NextLevel ->
          if model.allReqMet then
              (model, Random.generate RewardsGenerated
                   <| ProcGen.generateReward (Board.countTotalReq model.board) model.procGenState
              )
          else
              (model , Cmd.none)

      RewardsGenerated (newState, reward) ->
          let newProcGenState = { newState | level = newState.level + 1 }
          in ( { model
                   | rewards = Just reward
                   , allReqMet = False
                   , tiles = Board.gatherAllTiles model.board ++ model.tiles
                   , procGenState = newProcGenState
               }
             , Cmd.batch [ Random.generate NewBoard
                               (ProcGen.generateBoard newProcGenState.level)
                         , Random.generate NewPieceList
                             <| ProcGen.generatePieceList newProcGenState
                         ]
             )

      RewardSelected tile ->
          ( { model | selectedReward = Just tile }, Cmd.none )

      RewardConfirmed ->
          Maybe.withDefault (model, Cmd.none) <|
              Maybe.map2
                  (\reward tile ->
                         ({ model | tiles = tile :: model.tiles
                          , rewards = Nothing
                          , selectedReward = Nothing
                          , essences = reward.essences ++ model.essences
                          , craftingTable =
                              Crafting.addCraftingMats
                                  model.craftingTable
                                  reward.scrolls
                                  reward.orbs
                          }, Cmd.none
                         )
                  )
                  model.rewards
                  model.selectedReward

handleDragMsg : Items.Msg -> Model -> (Model, Cmd Msg)
handleDragMsg dragMsg model =
    case dragMsg of
        Items.DragFromHandStart drag ->
            ( removeDragFromHand drag { model | dragedItem = drag }, Cmd.none )

        Items.DragFromBoardStart index ->
            case Board.get index model.board of
                Just (Board.Empty pieceId _) ->
                    case Board.removePiece model.board pieceId of
                           Ok (board, piece) ->
                               ( updateDrag
                                     (Items.DragPiece
                                           <| Items.newDrawPosition
                                               (Just index)
                                               (Items.translatePiece index piece))
                                     { model | board = board, hoveredPiece = Nothing
                                     , allReqMet = Board.allReqMet board
                                     }
                               , Cmd.none
                               )
                           Err err ->
                              (model, Cmd.none)
                Just (Board.Filled _ tile _) ->
                    let newBoard = Board.removeTile index model.board
                    in ( { model
                               | dragedItem = Items.DragTile tile
                               , board = newBoard
                               , allReqMet = Board.allReqMet newBoard
                               , hoveredTile = Nothing
                         }, Cmd.none
                       )
                _ ->
                   (model, Cmd.none)

        Items.DragFromBenchStart drag ->
            (model, Cmd.none)

        Items.DragOverField index ->
            let indexedDrag = Items.indexDrag (Just index) model.dragedItem
            in case Board.get index model.board of
                   Just (Board.Filled pieceId tile _) ->
                       ( updateDrag indexedDrag
                             { model | hoveredTile = Just tile
                                     , hoveredPiece =
                                   List.Extra.find ((==) pieceId << .id) model.board.pieces -- Dict.get pieceId model.board.pieces
                             }, Cmd.none
                       )
                   Just (Board.Empty pieceId _) ->
                       ( updateDrag indexedDrag
                             { model | hoveredPiece =
                                   List.Extra.find ((==) pieceId << .id) model.board.pieces --Dict.get pieceId model.board.pieces }
                             }, Cmd.none )
                   _ -> 
                       ( updateDrag indexedDrag model, Cmd.none )

        Items.DragLeave ->
            ( { model
                    | board = Board.removeHighlight model.board
                    , hoveredTile = Nothing
                    , hoveredPiece = Nothing
                    , dragedItem = Items.indexDrag Nothing model.dragedItem
              }
            , Cmd.none
            )

        Items.DragDrop ->
                case Board.insertDrag model.board model.dragedItem of
                    Ok board ->
                        dragEnd True
                            <| updateHover
                                { model | board = board, allReqMet = Board.allReqMet board }
                    Err _ ->
                       dragEnd False model 


dragEnd : Bool -> Model -> (Model, Cmd Msg)
dragEnd success model =
    let addedToHand = 
            if not success then
                case model.dragedItem of
                    Items.DragTile tile ->
                        { model | tiles = tile :: model.tiles }
                    Items.DragPiece piece ->
                        { model | pieces =
                              { piece | drawPosition = Nothing, positions = [] } :: model.pieces
                        }
                    Items.DragEssence essence ->
                        { model | essences = essence :: model.essences }
                    _ -> model
            else model
    in ({ addedToHand | dragedItem = Items.None, board = Board.removeHighlight model.board}
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
          ,  style "width" "100vw"
          , style "overflow" "hidden"
          , style "position" "relative"
         -- , style "padding-left" "1vw"
          ] ++
              if model.dragedItem == Items.None then []
              else [ Events.onMouseUp <| DragMsg Items.DragDrop ]
        ) <|
        [ viewRewards model
        , drawHeadline model
        , div
              [ style "display" "grid"
              , style "grid-template-columns" "3fr 4fr"
              , style "grid-gap" "10px"
              --, style "height" "100vh"
              , style "align-content" "center"
              ]
              [ viewLeftPane model
              , viewRightPane model
              ]
        , drawTooltip model
        ] 

drawHeadline : Model -> Html Msg
drawHeadline model =
    div [ style "height" "5vh"
        , style "background-color" "grey"
        , style "display" "flex"
        , style "justify-content" "space-between"
        ]
        [ div []
              [text <| "Level: " ++ String.fromInt model.procGenState.level]
        , div []
              [ text <| if model.allReqMet then "You can progress to the next level"
                    else "Some requeriments are not yet met"
              ]
        , button [Events.onClick NextLevel] [text "Next Level"]
        ]

        
drawTooltip : Model -> Html Msg
drawTooltip model =
    if model.showTileTooltip then
        div [ style "display" "block"
            , style "left"
                <| String.fromInt (Tuple.first model.mousePos + 10) ++ "px"
            , style "top"
                <| String.fromInt (Tuple.second model.mousePos + 10) ++ "px"
            , style "position" "absolute"
            ] <|
            (Maybe.withDefault [] <|
                Maybe.map (List.singleton << Items.drawTileTooltip) model.hoveredTile)
            ++ (Maybe.withDefault [] <|
                    Maybe.map
                        (List.singleton << Items.drawPieceTooltip)
                        model.hoveredPiece)
    else
        div [] []

viewLeftPane : Model -> Html Msg
viewLeftPane model =
    div
        [ style "border" "0.8em double black"
        , style "background-color" "white"
        --, style "height" "90vh"
        , style "width" "45vw"
        , style "margin" "1vw"
        ] 
        [ div [ style "height" "6.5em"
              , style "display" "flex"
              , style "flex-wrap" "wrap"
              , style "align-items" "center"
              , style "gap" "5px"
              ]
            <| List.map
                (Html.map DragMsg << Items.drawPieceIcon (model.dragedItem == Items.None))
                model.pieces
        , div [style "display" "flex", style "gap" "5px", style "flex-wrap" "wrap"]
            <| List.map
                (Html.map DragMsg << Items.drawTileIcon (model.dragedItem == Items.None))
                model.tiles
        , div [style "display" "flex", style "gap" "5px", style "flex-wrap" "wrap"]
            <| List.map
                (Html.map DragMsg
                     --<< Html.map Crafting.DragMsg
                     << Items.drawEssence Items.DragFromHandStart) model.essences
        , Html.map CraftingMsg <| Crafting.viewCraftingTable model.craftingTable
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

viewRewards : Model -> Html Msg
viewRewards model =
    case model.rewards of
        Just rewards ->
            div [ style "position" "fixed"
                , style "top" "50%"
                , style "left" "50%"
                , style "z-index" "10"
                , style "background-color" "grey"
                , style "transform" "translate(-50%, -50%)"
                ]
                [ div [] <| List.map (drawTileIconReward model.selectedReward) rewards.tiles
                , div [ style "display" "flex" ]
                    <| List.map (Items.drawEssenceIcon >> (div [class "tile"])) rewards.essences
                , div [ style "display" "flex"]
                    <| List.map
                          (\(scrl, quant) ->
                               div []
                                   [ text <|
                                         Crafting.scrollToText scrl ++ ": " ++ String.fromInt quant
                                   ]
                          )
                          rewards.scrolls
                , div [ style "display" "flex"]
                    <| List.map
                           (\(orb, quant) ->
                                div []
                                    [ Items.drawColorCircle orb
                                    , text <| ": " ++ String.fromInt quant
                                    ]
                           )
                           rewards.orbs
                , button [Events.onClick RewardConfirmed]
                    [text "Confirm"]
                ]
        Nothing ->
            div [] []

drawTileIconReward : Maybe Items.Tile -> Items.Tile -> Html Msg
drawTileIconReward selectedTile tile =
    div [ style "display" "inline-block"
        , class "tile"
        , Events.onClick (RewardSelected tile)
        , style "border"
            <| if Just tile == selectedTile then "2px solid black" else "none"
        ] <| 
        [ Items.drawTileIconSvg tile
        , div [ class "tooltip" ] [ Items.drawTileTooltip tile ]
        ]
