(function($) {

	$.fn.Chess = function() {

		var el = $(this);
		var turn = 'black', isChangePiece = false;
		$('<h3 class="msg">White move</h3>').insertBefore(el);
		var manageTurn = function() {
			if (turn == "black") {
				turn = 'white';
				$('.wt').draggable("enable");
				$('.bl').draggable("disable");
			} else {
				$('.wt').draggable("disable");
				$('.bl').draggable("enable");
				turn = 'black';
			}
		}
		// structure of the board by row. Show classes
		var board = {
			"rows" : [['bl bROOK', 'bl bKNIGHT', 'bl bBISHOP', 'bl bQUEEN', 'bl bKING', 'bl bBISHOP', 'bl bKNIGHT', 'bl bROOK'], ['bl bPAWN', 'bl bPAWN', 'bl bPAWN', 'bl bPAWN', 'bl bPAWN', 'bl bPAWN', 'bl bPAWN', 'bl bPAWN'], ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'], ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'], ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'], ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'], ['wt wPAWN', 'wt wPAWN', 'wt wPAWN', 'wt wPAWN', 'wt wPAWN', 'wt wPAWN', 'wt wPAWN', 'wt wPAWN'], ['wt wROOK', 'wt wKNIGHT', 'wt wBISHOP', 'wt wQUEEN', 'wt wKING', 'wt wBISHOP', 'wt wKNIGHT', 'wt wROOK']]
		};

		var Castling = {
			"isWtLeftCastling" : true,
			"isWtRightCastling" : true,
			"isBlLeftCastling" : true,
			"isBlRightCastling" : true
		};

		var drawBoard = function(isManageTurn) {

			var strArray = [], cls = '';

			if (isManageTurn) {
				var msg = (turn == "black") ? 'White move' : 'Black move';
				$(".msg").html(msg);
			}

			for (var i = 0; i < 8; i++) {
				strArray.push('<div class="row">');
				for (var j = 0; j < 8; j++) {
					strArray.push('<div class="rowcol' + i + j + ' spot ' + ((i + j) % 2 === 0 ? '' : 'dark') + '">' + '<div class="' + board.rows[i][j] + '"></div>' + '</div>');
				}
				strArray.push('</div>');
			}

			el.html(strArray.join(''));

			$(".spot > div").draggable({
				revert : 'invalid'
			});

			$(".spot").droppable({
				drop : function(event, ui) {
					finishMove(ui.draggable, $(this));
				}
			});

			if (!isManageTurn)
				turn = (turn == "black") ? 'white' : 'black';

			manageTurn();
		}
		drawBoard(true);

		var finishMove = function(fromPiece, targetSpace) {
			var fromPos = fromPiece.parent()[0].classList[0].substring(6), toPos = targetSpace[0].classList[0].substr(6), isCheckMate = false, fromPieceEl = fromPiece[0];

			isChangePiece = false;

			// there is no move perform
			if (fromPos == toPos)
				return false;

			//check if move was correct
			var isCorrect = checkCorrectMove(fromPieceEl, fromPos, toPos, false);

			if (isCorrect) {
				$(fromPiece).attr("newPos", toPos);
				isCheckMate = CheckMate(fromPieceEl.classList[0], toPos);
			}

			if (!isCorrect || !isCheckMate) {
				drawBoard(false);
				return false;
			}

			// save new positions at board
			board.rows[parseInt(fromPos.substr(0, 1), 10)][parseInt(fromPos.substr(1, 1), 10)] = 'e';
			board.rows[parseInt(toPos.substr(0, 1), 10)][parseInt(toPos.substr(1, 1), 10)] = fromPieceEl.classList[0] + ' ' + fromPieceEl.classList[1];

			if (!isChangePiece)
				drawBoard(true);
			else
				selectNewPiece(fromPiece[0].classList[0], toPos)
		}
		var checkCorrectMove = function(fromPiece, fromPos, toPos, statuscheck) {
			var pieceColor = fromPiece.classList[0];
			var pieceType = fromPiece.classList[1].substring(1);

			if (!statuscheck) {
				var targetSpot = $('.rowcol' + toPos + '>div');
				if ((pieceColor == 'wt' && targetSpot.hasClass("wt")) || (pieceColor == 'bl' && targetSpot.hasClass("bl")))
					return false;
				//spot already taken by same color
			}

			var isCorrect = true;
			switch (pieceType) {
				case 'PAWN':
					isCorrect = checkPawn(pieceColor, fromPos, toPos);
					break;
				case 'BISHOP':
					isCorrect = checkBishop(pieceColor, fromPos, toPos);
					break;
				case 'KNIGHT':
					isCorrect = checkKnight(pieceColor, fromPos, toPos);
					break;
				case 'ROOK':
					isCorrect = checkRook(pieceColor, fromPos, toPos);
					break;
				case 'QUEEN':
					isCorrect = checkQueen(pieceColor, fromPos, toPos);
					break;
				case 'KING':
					isCorrect = checkKing(pieceColor, fromPos, toPos);
					break;
			}

			return isCorrect;
		}
		var checkKnight = function(pieceColor, fromPos, toPos) {
			var fromRow = parseInt(fromPos.substr(0, 1), 10), fromCol = parseInt(fromPos.substr(1, 1), 10), newPos = '';

			if (fromRow > 1) {
				if (fromCol != 0) {
					newPos = (fromRow - 2).toString() + (fromCol - 1).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
				if (fromCol != 7) {
					newPos = (fromRow - 2).toString() + (fromCol + 1).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
			}

			if (fromRow > 0) {
				if (fromCol > 1) {
					newPos = (fromRow - 1).toString() + (fromCol - 2).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
				if (fromCol < 6) {
					newPos = (fromRow - 1).toString() + (fromCol + 2).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
			}

			if (fromRow < 6) {
				if (fromCol != 0) {
					newPos = (fromRow + 2).toString() + (fromCol - 1).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
				if (fromCol != 7) {
					newPos = (fromRow + 2).toString() + (fromCol + 1).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
			}

			if (fromRow < 7) {
				if (fromCol > 1) {
					newPos = (fromRow + 1).toString() + (fromCol - 2).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
				if (fromCol < 6) {
					newPos = (fromRow + 1).toString() + (fromCol + 2).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);
				}
			}

			return false;
		}
		var checkBishop = function(pieceColor, fromPos, toPos) {
			var fromRow = parseInt(fromPos.substr(0, 1), 10), fromCol = parseInt(fromPos.substr(1, 1), 10), isBlockedLeft = false, isBlockedRight = false, r = 0, c = 1, newPos = '';

			//bishop should move on the same color
			var isFromDark = $('.rowcol' + fromPos + '>div').parent().hasClass("dark"), isToDark = $('.rowcol' + toPos + '>div').parent().hasClass("dark");

			if ((isFromDark && (!isToDark)) || (isToDark && (!isFromDark)))
				return false;

			// up left/right
			for ( r = fromRow - 1; r >= 0; r--) {
				if (fromCol - c >= 0 && !isBlockedLeft) {
					newPos = r.toString() + (fromCol - c).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);

					isBlockedLeft = blockThePath(newPos);
				}

				if (fromCol + c <= 7 && !isBlockedRight) {
					newPos = r.toString() + (fromCol + c).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);

					isBlockedRight = blockThePath(newPos);
				}

				if (isBlockedLeft && isBlockedRight)
					break;

				c++;
			}

			// down left/right
			c = 1;
			isBlockedLeft = false;
			isBlockedRight = false;
			for ( r = fromRow + 1; r < 8; r++) {
				if (fromCol - c >= 0 && !isBlockedLeft) {
					newPos = r.toString() + (fromCol - c).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);

					isBlockedLeft = blockThePath(newPos);
				}

				if (fromCol + c <= 7 && !isBlockedRight) {
					newPos = r.toString() + (fromCol + c).toString();
					if (newPos == toPos)
						return checkGoodSpot(pieceColor, newPos);

					isBlockedRight = blockThePath(newPos);
				}

				if (isBlockedLeft && isBlockedRight)
					break;

				c++;
			}

			return false;
		}
		var checkRook = function(pieceColor, fromPos, toPos) {
			var fromRow = parseInt(fromPos.substr(0, 1), 10), fromCol = parseInt(fromPos.substr(1, 1), 10), isBlocked = false, r = 0, c = 0, newPos = '';

			// up
			for ( r = fromRow - 1; r >= 0; r--) {
				if (isBlocked)
					break;
				newPos = r.toString() + fromCol.toString();
				if (newPos == toPos)
					return checkGoodSpot(pieceColor, newPos);

				isBlocked = blockThePath(newPos);
			}

			// down
			isBlocked = false;
			for ( r = fromRow + 1; r < 8; r++) {
				if (isBlocked)
					break;
				newPos = r.toString() + fromCol.toString();
				if (newPos == toPos)
					return checkGoodSpot(pieceColor, newPos);

				isBlocked = blockThePath(newPos);
			}

			// left
			isBlocked = false;
			for ( c = fromCol - 1; c >= 0; c--) {
				if (isBlocked)
					break;
				newPos = fromRow.toString() + c.toString();
				if (newPos == toPos)
					return checkGoodSpot(pieceColor, newPos);

				isBlocked = blockThePath(newPos);
			}

			// right
			isBlocked = false;
			for ( c = fromCol + 1; c < 8; c++) {
				if (isBlocked)
					break;
				newPos = fromRow.toString() + c.toString();
				if (newPos == toPos)
					return checkGoodSpot(pieceColor, newPos);

				isBlocked = blockThePath(newPos);
			}

			return false;
		}
		var checkPawn = function(pieceColor, fromPos, toPos) {
			var fromRow = parseInt(fromPos.substr(0, 1), 10), fromCol = parseInt(fromPos.substr(1, 1), 10), newSpot = null, newPos = '';

			if (pieceColor == 'wt') {
				//white pawn go straight up or kill black on diagonal

				// one step up
				newPos = (fromRow - 1).toString() + fromCol;
				newSpot = $('.rowcol' + newPos + '>div');

				if (newPos != toPos) {
					// inially pawn can go up twice when one step up is empty
					if (fromRow == 6 && newSpot.hasClass("e")) {
						newPos = (fromRow - 2).toString() + fromCol;
					}
					if (newPos != toPos) {// check diagonals
						var leftPosDiag = '', rightPosDiag = '';

						if (fromCol != 0)
							leftPosDiag = (fromRow - 1).toString() + (fromCol - 1).toString();
						if (fromCol != 7)
							rightPosDiag = (fromRow - 1).toString() + (fromCol + 1).toString();

						if (leftPosDiag != '' && $('.rowcol' + leftPosDiag + '>div').hasClass("bl"))
							newPos = leftPosDiag;
						if (rightPosDiag != '' && $('.rowcol' + rightPosDiag + '>div').hasClass("bl"))
							newPos = rightPosDiag;
					}
					newSpot = $('.rowcol' + newPos + '>div');
					if (!(newSpot.hasClass("e") || newSpot.hasClass("bl")))
						return false;

				}

				if (fromRow == 1 && newPos == toPos) {
					//next row is 0 and pawn can be changed to a different figure (like Queen). will handle later.
					isChangePiece = true;
				}

			} else {
				//black pawn go straight down or kill white on diagonal

				// one step down
				newPos = (fromRow + 1).toString() + fromCol;
				var newSpot = $('.rowcol' + newPos + '>div');

				if (newPos != toPos) {
					// inially pawn can go up twice when one step down is empty
					if (fromRow == 1 && newSpot.hasClass("e")) {
						newPos = (fromRow + 2).toString() + fromCol;
					}
					if (newPos != toPos) {// check diagonals
						var leftPosDiag = '', rightPosDiag = '';
						if (fromCol != 0)
							leftPosDiag = (fromRow + 1).toString() + (fromCol - 1).toString();
						if (fromCol != 7)
							rightPosDiag = (fromRow + 1).toString() + (fromCol + 1).toString();

						if (leftPosDiag != '' && $('.rowcol' + leftPosDiag + '>div').hasClass("wt"))
							newPos = leftPosDiag;
						if (rightPosDiag != '' && $('.rowcol' + rightPosDiag + '>div').hasClass("wt"))
							newPos = rightPosDiag;
					}
					newSpot = $('.rowcol' + newPos + '>div');
					if (!(newSpot.hasClass("e") || newSpot.hasClass("wt")))
						return false;
				}

				if (fromRow == 6 && newPos == toPos) {
					//next row is 7 and pawn can be changed to a different figure (like Quenn). will handle later.
					isChangePiece = true;
				}

			}

			if (newSpot && newPos == toPos)
				return true;

			return false;
		}
		var checkQueen = function(pieceColor, fromPos, toPos) {
			var checkRookMoves = checkRook(pieceColor, fromPos, toPos);
			if (!checkRookMoves) {
				return checkBishop(pieceColor, fromPos, toPos);
			} else
				return checkRookMoves;
		}
		var checkKing = function(pieceColor, fromPos, toPos) {
			var fromRow = parseInt(fromPos.substr(0, 1), 10), fromCol = parseInt(fromPos.substr(1, 1), 10), toRow = parseInt(toPos.substr(0, 1), 10), toCol = parseInt(toPos.substr(1, 1), 10), newPos = '';

			// check if move was not more than one row or/and one column
			if (Math.abs(fromRow - toRow) < 2 && Math.abs(fromCol - toCol) < 2) {
				$(".rowcol" + toPos).html($(".rowcol" + fromPos).html());
				$(".rowcol" + fromPos).html('<div class="e ui-draggable" style="position: relative;"></div>')
				return true;
			}

			return false;
		}
		var CheckMate = function(pieceColor, newPos) {
			var existedPieces = null, wKingPos = $(".wKING").parent()[0].classList[0].substring(6), bKingPos = $(".bKING").parent()[0].classList[0].substring(6), existedWhite = $(".wt:not(.wKING)"), //all existing black pieces except king
			existedBlack = $(".bl:not(.bKING)"), //all existing black pieces except king
			isCheckWtKing = false, isCheckBlKing = false;

			if (pieceColor == 'wt' && $(".wKING").attr("newPos"))
				wKingPos = $(".wKING").attr("newPos");
			if (pieceColor == 'bl' && $(".bKING").attr("newPos"))
				bKingPos = $(".bKING").attr("newPos");

			//validate check for black king;
			isCheckBlKing = loopPiecesForCheck(existedWhite, bKingPos, newPos);

			//the move is illegal because it causing check to own king
			if (isCheckBlKing && pieceColor == 'bl')
				return false;

			//validate check for white king;
			isCheckWtKing = loopPiecesForCheck(existedBlack, wKingPos);

			//the move is illegal because it causing check to own king
			if (isCheckWtKing && pieceColor == 'wt')
				return false;

			return true;
		}
		var loopPiecesForCheck = function(pieces, toPos, newPos) {
			var fromPos = '', isCheck = false, newPosAttr = '';

			$.each(pieces, function(i, piece) {
				fromPos = $(piece).parent()[0].classList[0].substring(6);
				if (fromPos != newPos) {
					newPosAttr = $(piece).attr("newPos");
					if (newPosAttr)
						fromPos = newPosAttr;

					isCheck = checkCorrectMove(piece, fromPos, toPos, true);
					if (isCheck)
						return false;
				}
			});

			return isCheck;
		}
		var checkGoodSpot = function(pieceColor, newPos) {
			newSpot = $('.rowcol' + newPos + '>div');
			if (newSpot.hasClass("e") || (pieceColor == 'wt' && newSpot.hasClass("bl")) || (pieceColor == 'bl' && newSpot.hasClass("wt")))
				return true;
			else
				return false;
		}
		var blockThePath = function(newPos) {
			return !$('.rowcol' + newPos + '>div').hasClass("e");
		}
		var addEvent = (function() {
			if (document.addEventListener) {
				return function(el, type, fn) {
					el.addEventListener(type, fn, false);
				};
			} else {
				return function(el, type, fn) {
					el.attachEvent('on' + type, handler);
				};
			}
		})();

		var selectNewPiece = function(pieceColor, toPos) {
			//create opacity div
			$('body').append('<div id="disableddiv" class="disableddiv">&nbsp;</div>');

			var choices = '', defis = '';
			if (pieceColor == "wt")
				defis = 'wt w';
			else
				defis = 'bl b';

			choices = '<dl><dt>Select new piece</dt><dd value="' + defis + 'QUEEN">Queen</dd><dd value="' + defis + 'ROOK">Rook</dd><dd value="' + defis + 'BISHOP">Bishop</dd><dd value="' + defis + 'KNIGHT">Knight</dd></dl>';

			var brd = $("#chessboard")[0];
			var topPos = brd.offsetTop + 140;
			var leftPos = brd.offsetLeft + 110;

			$('body').append('<div id="newpeice" class="newpeice">' + choices + '</div>');
			$('#newpeice').css("top", topPos).css("left", leftPos);

			$.each($("dd"), function(i, el) {
				$(el).attr("newPos", toPos);

				addEvent(el, 'click', function(event) {
					var newPiece = $(this).attr("value");
					var newPos = $(this).attr("newPos");
					board.rows[parseInt(newPos.substr(0, 1), 10)][parseInt(newPos.substr(1, 1), 10)] = newPiece;

					$('#disableddiv').remove();
					$('#newpeice').remove();

					drawBoard(true);
				});
			});
		}
	}
})(jQuery);

