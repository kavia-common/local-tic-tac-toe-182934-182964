import "./style.css";

/**
 * PUBLIC_INTERFACE
 * initTicTacToe initializes the game UI within #app
 */
export function initTicTacToe() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="page">
      <div class="container">
        <header class="header">
          <h1 class="title">Tic Tac Toe</h1>
          <p class="subtitle">Two players • Local play</p>
        </header>

        <section class="status-card" role="region" aria-label="Game status">
          <div id="status" class="status">
            <span id="playerX" class="chip chip-x">X</span>
            <span class="vs">vs</span>
            <span id="playerO" class="chip chip-o">O</span>
          </div>
          <div id="message" class="message" aria-live="polite">Player X's turn</div>
        </section>

        <section class="board-wrap" role="region" aria-label="Tic Tac Toe board">
          <div id="board" class="board" role="grid" aria-label="Tic Tac Toe grid">
            ${Array.from({ length: 9 })
              .map(
                (_, i) => `
              <button
                class="cell"
                role="gridcell"
                aria-label="Cell ${i + 1} empty"
                data-index="${i}"
              ></button>`
              )
              .join("")}
          </div>
        </section>

        <footer class="footer">
          <button id="restart" class="btn-restart" aria-label="Restart the game" type="button">
            Restart
          </button>
        </footer>
      </div>
    </div>
  `;

  // Game state
  let board = Array(9).fill(null); // values: 'X' | 'O' | null
  let xIsNext = true;
  let isGameOver = false;

  const messageEl = document.getElementById("message");
  const playerXEl = document.getElementById("playerX");
  const playerOEl = document.getElementById("playerO");
  const boardEl = document.getElementById("board");
  const restartBtn = document.getElementById("restart");

  // Helper: Determine winner or draw
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every((s) => s)) {
      return { winner: null, draw: true };
    }
    return null;
  }

  function updateStatus() {
    const result = calculateWinner(board);
    // Update active player chip styling
    playerXEl.classList.toggle("active", xIsNext && !isGameOver);
    playerOEl.classList.toggle("active", !xIsNext && !isGameOver);

    if (result?.winner) {
      isGameOver = true;
      const w = result.winner;
      messageEl.textContent = `Player ${w} wins!`;
      messageEl.classList.remove("neutral");
      messageEl.classList.add(w === "X" ? "xwin" : "owin");
      // Highlight winning cells
      result.line.forEach((idx) => {
        const cell = boardEl.querySelector(`.cell[data-index="${idx}"]`);
        cell.classList.add("win");
      });
      // Update aria labels
      updateAriaLabels();
      return;
    }
    if (result?.draw) {
      isGameOver = true;
      messageEl.textContent = "It's a draw!";
      messageEl.classList.remove("neutral");
      messageEl.classList.add("draw");
      updateAriaLabels();
      return;
    }
    // Ongoing
    messageEl.textContent = `Player ${xIsNext ? "X" : "O"}'s turn`;
    messageEl.classList.remove("xwin", "owin", "draw");
    messageEl.classList.add("neutral");
    updateAriaLabels();
  }

  function updateAriaLabels() {
    const cells = boardEl.querySelectorAll(".cell");
    cells.forEach((btn, idx) => {
      const v = board[idx];
      const status = v ? `${v}` : "empty";
      btn.setAttribute("aria-label", `Cell ${idx + 1} ${status}`);
    });
  }

  function render() {
    const cells = boardEl.querySelectorAll(".cell");
    cells.forEach((btn, idx) => {
      btn.textContent = board[idx] ?? "";
      btn.classList.toggle("is-x", board[idx] === "X");
      btn.classList.toggle("is-o", board[idx] === "O");
      btn.disabled = isGameOver || !!board[idx];
      btn.setAttribute("tabindex", "0");
    });
    updateStatus();
  }

  function handleCellClick(e) {
    const idx = Number(e.currentTarget.getAttribute("data-index"));
    if (isGameOver || board[idx]) return;
    board[idx] = xIsNext ? "X" : "O";
    xIsNext = !xIsNext;
    render();
  }

  // Attach events
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((btn) => {
    btn.addEventListener("click", handleCellClick);
    // Keyboard support: Enter/Space acts as click
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  restartBtn.addEventListener("click", () => {
    board = Array(9).fill(null);
    xIsNext = true;
    isGameOver = false;
    boardEl.querySelectorAll(".cell").forEach((c) => c.classList.remove("win"));
    render();
  });

  // Initial render
  render();
}

// Initialize app
initTicTacToe();
