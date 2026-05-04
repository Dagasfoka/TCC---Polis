# Partido
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.base import Base


class Party(Base):
    __tablename__ = "parties"

    id: Mapped[str] = mapped_column(String(2), primary_key=True)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    color: Mapped[str] = mapped_column(String(15), nullable=False)
    def __repr__(self) -> str:
        return (
            f"Party(id={self.id!r}, \n"
            f"name={self.name!r}, \n" 
            f"color={self.color!r}, "
        )