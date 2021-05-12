module Crafting exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events 
import List.Extra

import Board exposing (Color(..))
import Demo

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

type alias Orb = Board.Color

type alias Essence = Board.Property

type alias TableState =
    { tile : Maybe Board.Tile
    , scrolls : List (Scroll, Int)
    , orbs : List (Orb, Int)
    , selectedScroll : Maybe Scroll
    , selectedOrbs : List Orb
    , selectedEssence : Maybe Essence
    }

type Msg
    = Craft
    | ScrollSelected Scroll
    | OrbSelected Orb

init : TableState
init =
    { tile = Just Demo.probaTile
    , scrolls = emptyScrolls
    , orbs = emptyOrbs
    , selectedScroll = Just Augmentation
    , selectedOrbs = []
    , selectedEssence = Nothing
    }

emptyScrolls : List (Scroll, Int)
emptyScrolls =
    [(Modification, 0), (Augmentation, 0), (Alteration, 0), (Distillation, 0)]

emptyOrbs : List (Orb, Int)
emptyOrbs =
    [(Purple, 0), (Green, 0), (Yellow, 0), (Orange, 0)]

update : Msg -> TableState -> TableState
update msg state =
    case msg of
        Craft -> state
        ScrollSelected scroll ->
            if Just scroll == state.selectedScroll then
                { state | selectedScroll = Nothing }
            else
                { state | selectedScroll = Just scroll }
        OrbSelected orb ->
            if List.member orb state.selectedOrbs then
                { state | selectedOrbs =
                      List.Extra.remove orb state.selectedOrbs
                }
            else
                { state | selectedOrbs =
                      List.take 2 <| orb :: state.selectedOrbs
                }
    
viewCraftingTable : TableState -> Html Msg 
viewCraftingTable state =
    div []
        [ button [Html.Events.onClick Craft] [text "Craft"]
        , div
            [ style "display" "flex"
            , style "gap" "5px"
            ]
            [ viewTileBench state.tile state.selectedEssence
            , viewScrolls state.scrolls state.selectedScroll
            , viewOrbs state.orbs state.selectedOrbs
            ]
        ]

viewTileBench : Maybe Board.Tile -> Maybe Essence -> Html Msg
viewTileBench tile essence =
    div [ style "background-color" "grey"
        , style "width" "5vw"
        , style "height" "8vw"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "center"
        , style "align-items" "center"
        ]
        [ drawTileIcon tile
        ]

drawTileIcon : Maybe Board.Tile -> Html Msg
drawTileIcon mTile =
    case mTile of
        Just tile ->
            Board.drawTileIconSvg tile
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
                     , Html.Events.onClick <| ScrollSelected scrl
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
                     , Html.Events.onClick <| OrbSelected orb
                     ]
                     [ Board.drawColorCircle orb
                     , text <| ": " ++ String.fromInt quant
                     ]
            )
            orbs
