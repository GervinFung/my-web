import {Board} from '../board/Board.js';
import Move from '../move/Move.js';
import League from '../piece/League.js';

class Player {
    legalMoves;

    constructor(board) {
        this.legalMoves = this.generateLegalMoves(board);
        if (this.constructor === Player) {
            throw new TypeError('Abstract class "Piece" cannot be instantiated directly.');
        }
    }

    /**
     * Implementation
     */
    getOpponent() {
        throw new Error('To be implemented by sub-class');
    }

    getLeague() {
        throw new Error('To be implemented by sub-class');
    }

    getLegalMoves = () => this.legalMoves;

    toString = () => League.isBlack(this.getLeague()) ? 'Black' : 'Red';

    /**
     * Concrete
     */
    generateEmptyRows = (board) => {
        const emptyRows = [];

        let begin = Board.DEFAULT_COL * 5, min = 0;
        for (let i = begin; i >= min; i -= Board.DEFAULT_COL) {
            if (i === Board.DEFAULT_NUM_TILES) { break; }

            const tile = board.getTileAt(i);
            if (!tile.isTileOccupied()) {
                emptyRows.push(tile);
                min++;
                begin++;
                i = begin + Board.DEFAULT_COL;
            }
            else {
                if (i === min) {
                    min++;
                    begin++;
                    i = begin + Board.DEFAULT_COL;
                }
            }
        }

        return Object.freeze(emptyRows);
    };

    generateLegalMoves = (board) => {
        return Object.freeze(this.generateEmptyRows(board).map(emptyRow => new Move(this.getLeague(), emptyRow.getIndex())));
    };

    makeMove = (move, board) => {
        if (move == null) {
            throw new Error('Move cannot be null');
        }
        const moveFound = this.legalMoves.find(legalMove => legalMove.equals(move));
        if (moveFound.constructor === Move) {
            return moveFound.execute(board);
        }
        throw new Error('Move passed here is invalid');
    };

    checkHorizontalWin = (board) => {
        let numTileOccupied = 0;
        let begin = 0;
        for (let i = begin; i < Board.DEFAULT_NUM_TILES; i++) {
            const tile = board.getTileAt(i);
            if (tile.isTileOccupied()) {
                numTileOccupied = tile.getPiece().getLeague() === this.getOpponent(board).getLeague() ? numTileOccupied + 1 : 0;
                if (numTileOccupied === Board.DEFAULT_WIN_NUM_TILES) { return true; }
            }
            else { numTileOccupied = 0; }
            if (i - begin === Board.DEFAULT_ROW) {
                numTileOccupied = 0;
                begin += Board.DEFAULT_COL;
            }
        }
        return false;
    };

    checkVerticalWin = (board) => {
        let numTileOccupied = 0, begin = 0, max = Board.DEFAULT_COL * 5;

        for (let i = begin; i <= max; i += Board.DEFAULT_COL) {
            const tile = board.getTileAt(i);
            if (tile.isTileOccupied()) {
                numTileOccupied = tile.getPiece().getLeague() === this.getOpponent(board).getLeague() ? numTileOccupied + 1 : 0;
                if (numTileOccupied === Board.DEFAULT_WIN_NUM_TILES) { return true; }
            }
            else { numTileOccupied = 0; }

            if (i === max && max < Board.DEFAULT_NUM_TILES - 1) {
                begin++;
                i = begin - Board.DEFAULT_COL;
                max++;
                numTileOccupied = 0;
            }
        }
        return false;
    };

    checkDiagonalWin = (positiveSlope, board) => {
        const vector = positiveSlope ? -1 : 1;
        const negativeVector = vector * -1;
        const increment = Board.DEFAULT_COL + vector;
        let begin = (Board.DEFAULT_COL - 1) / 2;
        let max = positiveSlope ? 21 : 27, numTileOccupied = 0;
        let goEdge = false;

        for (let i = begin; i <= max; i += increment) {
            const tile = board.getTileAt(i);
            if (tile.isTileOccupied()) {
                numTileOccupied = tile.getPiece().getLeague() === this.getOpponent(board).getLeague() ? numTileOccupied + 1 : 0;
                if (numTileOccupied === Board.DEFAULT_WIN_NUM_TILES) { return true; }
            }
            else { numTileOccupied = 0; }
            if (i === max) {
                const compare = positiveSlope ? 20 : 14;
                if (begin === compare) { break; }
                const compareNum = positiveSlope ? increment : 0;
                if (begin === compareNum && !goEdge) { goEdge = true; }
                begin = goEdge ? begin + Board.DEFAULT_COL : begin + negativeVector;
                max = max + Board.DEFAULT_COL >= Board.DEFAULT_NUM_TILES ? max + negativeVector : max + Board.DEFAULT_COL;
                i = begin - increment;
                numTileOccupied = 0;
            }
        }
        return false;
    }

    isInCheckmate = (board) => this.checkVerticalWin(board) || this.checkHorizontalWin(board) || this.checkDiagonalWin(true, board) || this.checkDiagonalWin(false, board);

    isStalemate = (board) => board.getTileList().every(tile => tile.isTileOccupied());
}

class RedPlayer extends Player {
    constructor(board) {
        super(board);
    }
    getOpponent(board) {
        return board.getBlackPlayer();
    }
    getLeague() {
        return League.league.RED;
    }
}

class BlackPlayer extends Player {
    constructor(board) {
        super(board);
    }
    getOpponent(board) {
        return board.getRedPlayer();
    }
    getLeague() {
        return League.league.BLACK;
    }
}

export {
    BlackPlayer, RedPlayer
}