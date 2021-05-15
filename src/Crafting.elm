module Crafting exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as Events
import List.Extra
import Random
import Svg
import Svg.Attributes as Svga
import Json.Decode as Decode

import Board  
import Items exposing (Essence, Color(..))
import ProcGen
--import Demo

type Scroll
    = Modification
    | Augmentation
    | Alteration
    | Distillation

scrollToText : Scroll -> String
scrollToText scroll =
    case scroll of
        Modification -> "Modification"
        Augmentation -> "Augmentation"
        Alteration -> "Alteration"
        Distillation -> "Distillation"

type alias Orb = Items.Color

--type alias Essence = Board.Property

type alias TableState =
    { tile : Maybe Items.Tile
    , scrolls : List (Scroll, Int)
    , orbs : List (Orb, Int)
    , selectedScroll : Maybe Scroll
    , selectedOrbs : List Orb
    , selectedEssence : Maybe Essence
    }

type alias Model a =
    { a |
      craftingTable : TableState
    , craftingBenchHovered : Bool
    , procGenState : ProcGen.State
    , dragedItem : Items.Drag

    , tiles : List Items.Tile
    , pieces : List Items.Piece
    , essences : List Items.Essence
    }

type Msg
    = ApplyScroll
    | ScrollSelected Scroll
    | OrbSelected Orb
    -- | DragOverBench
    -- | DragLeave
    -- | DragStart Items.Drag
    | TileGenerated Items.Tile
    | DragMsg Items.Msg
updateModel : Model a -> TableState -> Model a
updateModel model state =
    { model | craftingTable = state }

update : Msg -> Model a -> (Model a, Cmd Msg)
update msg model =
    let craftingTable = model.craftingTable
    in case msg of
        ApplyScroll -> 
            case model.craftingTable.selectedScroll of
                Just Modification ->
                    case basicReqMet Modification model.craftingTable of
                        Ok tile ->
                           ( updateModel model <| removeMats Modification model.craftingTable
                           , Random.generate TileGenerated
                                  <| ProcGen.generateBase
                                      model.procGenState.level
                                      model.craftingTable.selectedOrbs tile
                           )
                        Err _ ->
                            (model, Cmd.none)

                Just Augmentation ->
                    case basicReqMet Augmentation model.craftingTable of
                        Ok tile ->
                            if List.length tile.properties <= 1 then
                                ( updateModel model <| removeMats Augmentation model.craftingTable
                                , Random.generate TileGenerated
                                       <| ProcGen.addProperty
                                           model.procGenState.level
                                           model.craftingTable.selectedOrbs tile
                                )
                            else
                                (model, Cmd.none)
                        Err _ ->
                            (model, Cmd.none)

                Just Alteration ->
                    case basicReqMet Alteration model.craftingTable of
                        Ok tile ->
                            ( updateModel model <| removeMats Alteration model.craftingTable
                            , Random.generate TileGenerated
                                   <| ProcGen.rerollProperties
                                       model.procGenState.level
                                       model.craftingTable.selectedOrbs tile
                            )
                        Err _ ->
                            (model, Cmd.none)
                                
                _ -> 
                    (model, Cmd.none)

        TileGenerated tile ->
            ( updateModel model { craftingTable | tile = Just tile }, Cmd.none )

        ScrollSelected scroll ->
            if Just scroll == model.craftingTable.selectedScroll then
                (updateModel model { craftingTable | selectedScroll = Nothing }, Cmd.none)
            else
                (updateModel model { craftingTable | selectedScroll = Just scroll }, Cmd.none)
        OrbSelected orb ->
            if List.member orb model.craftingTable.selectedOrbs then
                (updateModel model
                     { craftingTable | selectedOrbs =
                      List.Extra.remove orb model.craftingTable.selectedOrbs
                     }, Cmd.none
                )
            else
                (updateModel model
                     { craftingTable | selectedOrbs =
                      List.take 2 <| orb :: model.craftingTable.selectedOrbs
                     }, Cmd.none
                )

        DragMsg dragMsg ->
            case dragMsg of
                Items.DragFromBenchStart drag ->
                    ( { model
                          | craftingTable = removeDragFromBench craftingTable drag
                          , dragedItem = drag
                      }, Cmd.none
                    )
                Items.DragOverBench ->
                    ( { model | craftingBenchHovered = True }, Cmd.none )
                Items.DragLeave ->
                    ( { model | craftingBenchHovered = False }, Cmd.none )
                Items.DragDrop ->
                    case model.dragedItem of
                        Items.DragPiece piece ->
                            ( { model | pieces = piece :: model.pieces }, Cmd.none )
                        Items.DragTile tile ->
                            if craftingTable.tile == Nothing then
                                let droppedTile = { craftingTable | tile = Just tile }
                                in ( { model | craftingTable = droppedTile }, Cmd.none )
                            else
                                ( { model | tiles = tile :: model.tiles }, Cmd.none )
                        Items.DragEssence essence ->
                            if craftingTable.selectedEssence == Nothing then
                                let droppedEssence =
                                        { craftingTable | selectedEssence = Just essence }
                                in ( { model | craftingTable = droppedEssence }, Cmd.none )
                            else
                                ( { model | essences = essence :: model.essences }, Cmd.none )
                        Items.None ->
                            ( model, Cmd.none )
                _ ->
                    (model, Cmd.none)

removeDragFromBench : TableState -> Items.Drag -> TableState
removeDragFromBench state drag =
    case drag of
        Items.DragTile _ ->
            { state | tile = Nothing }
        Items.DragEssence _ ->
            { state | selectedEssence = Nothing }
        _ ->
            state
    
init : TableState
init =
    { tile = Nothing
    , scrolls = demoScrolls
    , orbs = demoOrbs
    , selectedScroll = Just Augmentation
    , selectedOrbs = []
    , selectedEssence = Nothing
    }

demoScrolls : List (Scroll, Int)
demoScrolls =
    [(Modification, 5), (Augmentation, 5), (Alteration, 5), (Distillation, 5)]

demoOrbs : List (Orb, Int)
demoOrbs =
    [(Purple, 5), (Green, 5), (Yellow, 5), (Orange, 5)]
        
-- type CraftingErr
--     = CannotDropCraftingBenchOccupied
--     | CannotDropPiece

-- dropDrag : Items.Drag -> TableState -> Result CraftingErr TableState
-- dropDrag drag state =
--     case drag of
--         Items.DragTile tile ->
--             case state.tile of
--                 Nothing ->
--                     Ok { state | tile = Just tile }
--                 Just _ ->
--                     Err CannotDropCraftingBenchOccupied
--         _ ->
--             Err CannotDropPiece

emptyScrolls : List (Scroll, Int)
emptyScrolls =
    [(Modification, 0), (Augmentation, 0), (Alteration, 0), (Distillation, 0)]

emptyOrbs : List (Orb, Int)
emptyOrbs =
    [(Purple, 0), (Green, 0), (Yellow, 0), (Orange, 0)]

basicReqMet : Scroll -> TableState -> Result () Items.Tile
basicReqMet scroll state =
    let hasScroll = 
            List.member scroll
                <| List.map Tuple.first
                <| List.filter ((<) 0 << Tuple.second) state.scrolls
        hasOrbs = 
            List.all
                (\orb -> List.member orb
                     <| List.map Tuple.first
                     <| List.filter ((<) 0 << Tuple.second) state.orbs
                )
                state.selectedOrbs
    in case state.tile of
           Nothing ->
               Err ()
           Just tile ->
               if hasScroll && hasOrbs then Ok tile else Err ()

removeMats : Scroll -> TableState -> TableState
removeMats scroll state =
    { state 
          | scrolls =
              List.Extra.updateIf
                  ((==) scroll << Tuple.first)
                  (Tuple.mapSecond <| (+) (-1))
                  state.scrolls
          , orbs =
              List.Extra.updateIf
                  ((\orb -> List.member orb state.selectedOrbs) << Tuple.first)
                  (Tuple.mapSecond <| (+) (-1))
                  state.orbs
    }

noCmd : Int -> Cmd Msg
noCmd _ = Cmd.none

viewCraftingTable : TableState -> Html Msg 
viewCraftingTable state =
    div []
        [ button
              [Events.onClick ApplyScroll]
              [text "Apply Scroll"]
        , div
            [ style "display" "flex"
            , style "gap" "5px"
            ]
            [ viewTileBench state.tile state.selectedEssence
            , viewScrolls state.scrolls state.selectedScroll
            , viewOrbs state.orbs state.selectedOrbs
            ]
        ]

viewTileBench : Maybe Items.Tile -> Maybe Essence -> Html Msg
viewTileBench tile essence =
    div [ style "background-color" "grey"
        , style "width" "5vw"
        , style "min-width" "max-content"
        , style "height" "8vw"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "center"
        , style "align-items" "center"
        , Events.onMouseEnter <| DragMsg Items.DragOverBench
        , Events.onMouseLeave <| DragMsg Items.DragLeave
        , Events.stopPropagationOn "mouseup" <| Decode.succeed (DragMsg Items.DragDrop, True)
        ]
        [ drawTileIcon tile
        , drawEssenceIcon essence
        ]

drawEssenceIcon : Maybe Essence -> Html Msg
drawEssenceIcon mEssence =
    case mEssence of
        Just essence ->
            Html.map DragMsg
                <| Items.drawEssence Items.DragFromBenchStart essence
        Nothing ->
            div [] []

drawTileIcon : Maybe Items.Tile -> Html Msg
drawTileIcon mTile =
    case mTile of
        Just tile ->
            Html.map DragMsg <|
                div [ Events.onMouseDown <| (Items.DragFromBenchStart <| Items.DragTile tile)
                    , class "tile"
                    ]
                    [ Items.drawTileIconSvg tile
                    , div [ class "tooltip" ] [ Items.drawTileTooltip tile ]
                    ]
        Nothing ->
            div [] []

viewScrolls : List (Scroll, Int) -> Maybe Scroll -> Html Msg
viewScrolls scrolls selected =
    let highlight scrl =
            if Just scrl == selected then
                style "border" "3px solid black"
            else
                style "border" "none"
    in div
        [ style "background-color" "grey"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        ] <|
        List.map
            (\(scrl, quant) ->
                 div [ highlight scrl
                     , Events.onClick <| ScrollSelected scrl
                     ]
                     [ text <| scrollToText scrl ++ ": " ++ String.fromInt quant]
            )
            scrolls
                           
viewOrbs : List (Orb, Int) -> List Orb -> Html Msg
viewOrbs orbs selected =
    let highlight orb =
            if List.member orb selected then
                style "border" "3px solid black"
            else
                style "border" "none"
    in div
        [ style "background-color" "grey"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        ] <|
        List.map
            (\(orb, quant) ->
                 div [ highlight orb
                     , Events.onClick <| OrbSelected orb
                     ]
                     [ Items.drawColorCircle orb
                     , text <| ": " ++ String.fromInt quant
                     ]
            )
            orbs

