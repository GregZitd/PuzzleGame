module Demo exposing (..)

import Board exposing (Piece, Shape(..), Color(..), Board, Tile, Field(..), emptyScore, ScoreDict, Property, PieceDict, TileDict)
import Dict exposing (Dict)
import Array

initPieces : PieceDict
initPieces = Dict.fromList [(0, probaPiece), (1, probaPiece2), (2, probaPiece3)]

initTiles : TileDict
initTiles = Dict.fromList [(0, probaTile), (1, probaTile2), (2, probaTile3), (3, probaTile4), (4, probaTile5), (5, probaTile6)]

probaPiece3 : Piece
probaPiece3 =
    { shape = Threei [(0,0), (0,1), (0,-1)]
    , borderTransform = {rotate = 0, translate = (0,0)}
    , drawPosition = Nothing
    , positions = []
    , req = [ (Purple, 0) , (Green, 2) , (Yellow, 2) , (Orange, 0) ]
    , score = emptyScore
    , level = 1
    }

probaPiece2 : Piece
probaPiece2 =
    { shape = Threel [(0,0), (0,-1), (1,0)]
    , borderTransform = {rotate = 0, translate = (0,0)}
    , drawPosition = Nothing
    , positions = []
    , req = [ (Purple, 2) , (Green, 2) , (Yellow, 0) , (Orange, 0) ]
    , score = emptyScore
    , level = 1
    }

probaPiece : Piece
probaPiece =
    { shape = Twoi [(0,0), (0,1)]
    , borderTransform = {rotate = 0, translate = (0,0)}
    , drawPosition = Nothing
    , positions = []
    , req = [ (Purple, 3) , (Green, 0) , (Yellow, 0) , (Orange, 0) ]
    , score = emptyScore
    , level = 1
    }

initBoard : Board
initBoard =
    (Board.set (1,2) (Wall False) << Board.set (3,1) (Wall False))
        { tiles =
            Array.repeat 4 <|
                Array.repeat 4 (NonTile False)
        , pieces = Dict.empty
        , highlight = []
        , rowReqs = Dict.insert 1
                    ( [ (Purple, 3) , (Green, 2) , (Yellow, 0) , (Orange, 0) ]
                    , emptyScore
                    ) <| Dict.insert 3
                            ( [ (Purple, 0) , (Green, 0) , (Yellow, 2) , (Orange, 2) ]
                            , emptyScore
                            )
                            Dict.empty
        , colReqs = Dict.insert 2
                    ( [ (Purple, 0) , (Green, 3) , (Yellow, 2) , (Orange, 0) ]
                    , emptyScore
                    ) Dict.empty
        }

probaTile : Tile
probaTile =
    { color = Green
    , baseValue = 1
    , currentValue = 1
    , prodBonus = 0
    , addBonus = 0
    , properties = []
    , drawPosition = Nothing
    , level = 1
    }

probaTile2 : Tile
probaTile2 =
    { color = Purple
    , baseValue = 1
    , currentValue = 1
    , prodBonus = 0
    , addBonus = 0
    , properties = [probaProperty2, probaProperty]
    , drawPosition = Nothing
    , level = 1
    }
    
probaProperty : Property
probaProperty =
    { reqColor = Green
    , region = [(1,0), (1,-1)]
    , reqValue = 2
    , prodBonus = 0
    , addBonus = 1
    , isMet = False
    }
    
probaProperty2 : Property
probaProperty2 =
    { reqColor = Green
    , region = [(1,0), (1,1)]
    , reqValue = 3
    , prodBonus = 1
    , addBonus = 0
    , isMet = False
    }

probaTile3 : Tile
probaTile3 =
    { color = Green
    , baseValue = 1
    , currentValue = 1
    , prodBonus = 0
    , addBonus = 0
    , properties = [probaProperty3]
    , drawPosition = Nothing
    , level = 1
    }

probaProperty3 : Property
probaProperty3 =
    { reqColor = Purple
    , region = [(1,0), (1,-1), (0,-1)]
    , reqValue = 2
    , prodBonus = 1
    , addBonus = 0
    , isMet = False
    }
    
probaTile4 : Tile
probaTile4 =
    { color = Orange
    , baseValue = 1
    , currentValue = 1
    , prodBonus = 0
    , addBonus = 0
    , properties = [probaProperty4]
    , drawPosition = Nothing
    , level = 1
    }

probaProperty4 : Property
probaProperty4 =
    { reqColor = Green
    , region = [(1,0), (1,-1), (0,-1)]
    , reqValue = 1
    , prodBonus = 1
    , addBonus = 0
    , isMet = False
    }

probaTile5 : Tile
probaTile5 =
    { color = Yellow
    , baseValue = 1
    , currentValue = 1
    , prodBonus = 0
    , addBonus = 0
    , properties = [probaProperty5]
    , drawPosition = Nothing
    , level = 1
    }

probaProperty5 : Property
probaProperty5 =
    { reqColor = Orange
    , region = [(0,-1), (0,1)]
    , reqValue = 2
    , prodBonus = 0
    , addBonus = 1
    , isMet = False
    }

probaTile6 : Tile
probaTile6 =
    { color = Green
    , baseValue = 1
    , currentValue = 1
    , prodBonus = 0
    , addBonus = 0
    , properties = [probaProperty6]
    , drawPosition = Nothing
    , level = 1
    }

probaProperty6 : Property
probaProperty6 =
    { reqColor = Yellow
    , region = [(0,-1), (1,0)]
    , reqValue = 2
    , prodBonus = 0
    , addBonus = 1
    , isMet = False
    }
