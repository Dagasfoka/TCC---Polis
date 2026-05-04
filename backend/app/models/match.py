# Status geral da partida.
from backend.app.models.match_territory import MatchTerritory
from backend.app.models.player import Player


class Match:
    def __init__(
        self,
        match_id:int, 
        territories:list[MatchTerritory], 
        room_code,
        players: list[Player], 
        round
        ):
        self.match_id=match_id
        self.territories=territories
        self.room_code=room_code
        self.players=players
        self.status="not_started"
        self.current_turn_player_id= None
        self.round=round

    def to_dict(self):
        return {
            "match_id": self.match_id,
            'territories':[t.to_dict() for t in self.territories],
            'room_code':self.room_code,
            'players':[
    p.to_dict() if hasattr(p, "to_dict") else p
    for p in self.players
                        ],
            'status':self.status,
            'current_turn_player_id': self.current_turn_player_id,
            'round':self.round
            }