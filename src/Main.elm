port module Main exposing (..)

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
import Url
import Url.Parser as Parser
import Browser.Navigation as Nav
import Json.Decode as D
import Json.Encode as E

import Board
import Items
import ProcGen
import Crafting
import Game


-- MAIN


main =
  Browser.application
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    , onUrlChange = UrlChanged
    , onUrlRequest = UrlRequested
    }


-- MODEL


type alias Model =
    { gameState : Maybe Game.Model
    , route : Route
    , storageTry : String
    , key : Nav.Key
    , url : Url.Url 
    }

init : E.Value -> Url.Url -> Nav.Key -> (Model, Cmd Msg)
init flags url key =
  ({ gameState = Nothing
   , route = toRoute url
   , storageTry =
       case D.decodeValue decoder flags of
           Ok str -> str
           Err _ -> "Nope"
   , key = key
   , url = url
   }
  , Nav.pushUrl key "/"
  )

--PORTS

port setStorage : E.Value -> Cmd msg

encode : Model -> E.Value
encode model =
    E.object
        [("name", E.string "Encode this")
        ]

decoder : D.Decoder String
decoder =
    D.field "name" D.string
    
--UPDATE

type Msg
    = GameMsg Game.Msg
    | NewGame
    | Continue
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url.Url

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GameMsg gameMsg ->
            case Maybe.map (Game.update gameMsg) model.gameState of
                Just (newGameState, cmdMsg) ->
                    ( { model | gameState = Just newGameState }
                    , Cmd.map GameMsg cmdMsg
                    )
                Nothing ->
                    ( model, Cmd.none )

        NewGame ->
            ( { model | gameState = Just Game.initModel }
            , Cmd.batch
                [ Cmd.map GameMsg Game.initMsg
                , Nav.pushUrl model.key "game"
                , setStorage (encode model)
                ]
            )

        Continue ->
            ( model, Cmd.none )
    
        UrlChanged url ->
            ( { model | url = url, route = toRoute url }, Cmd.none )

        UrlRequested urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )
    

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
    Maybe.withDefault Sub.none
        <| Maybe.map (Game.subscriptions >> Sub.map GameMsg) model.gameState
 
-- VIEW

view : Model -> Browser.Document Msg
view model =
    { title = "Greg Puzzle"
    , body =
        case model.route of
            --This is a bit hacky, because the Route should not be able to be "Game" if the
            --gameState is Nothing, so this Myabe.withDefault is just here to get rid of a Just,
            --it does not do any logic.
            Game -> [ Html.map GameMsg <| Game.viewGame (Maybe.withDefault Game.initModel model.gameState) ]
            HowTo -> [ viewHowTo model ]
            MainMenu -> [ viewMainMenu model ]
            NotFound -> [ viewNotFound model ]
    }

viewHowTo : Model -> Html Msg
viewHowTo model =
    div []
        [ text "How to page coming soon!" ]

viewNotFound : Model -> Html Msg
viewNotFound model =
    div []
        [ text "Page not found" ]

viewMainMenu : Model -> Html Msg
viewMainMenu model =
    div []
        [ p [] [ text "Main menu" ]
        , button [ Events.onClick NewGame ] [ text "New Game" ]
        , button [ Events.onClick Continue ] [text "Continoue Previous Game" ]
        ]

type Route
    = MainMenu
    | HowTo
    | Game
    | NotFound

routeParser : Parser.Parser (Route -> a) a
routeParser =
    Parser.oneOf
        [ Parser.map MainMenu Parser.top
        , Parser.map HowTo (Parser.s "howto")
        , Parser.map Game (Parser.s "game")
        ]

toRoute : Url.Url -> Route
toRoute url =
    Maybe.withDefault NotFound (Parser.parse routeParser url)
