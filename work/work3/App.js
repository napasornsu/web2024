class App extends React.Component {
    state = {
        qlist: [],
        status: 0, // 0: Menu, 1: Quiz, 2: Result
        answers: {},
        score: 0,
        valid: false,
    };

    async load_data() {
        const response = await fetch("quiz3.json");
        this.setState({ qlist: await response.json() });
    }

    componentDidMount() {
        this.load_data();
    }

    validate() {
        const valid = this.state.qlist.every((q, i) => this.state.answers["q" + i]);
        this.setState({ valid });
    }

    checkAnswer() {
        const score = this.state.qlist.reduce((total, q, i) => {
            return total + (q.answer === this.state.answers["q" + i] ? 1 : 0);
        }, 0);
        this.setState({ status: 2, score });
    }

    render() {
        return (
            <div className="card shadow-lg border-0">
                <div className="card-header text-center bg-pink text-white">
                    <h2>🍬🌸 ทดสอบความรู้เกี่ยวกับขนมหวาน 🌸🍬</h2>
                </div>
                <div className="card-body">
                    {this.state.status === 0 ? (
                        <Menu app={this} />
                    ) : this.state.status === 1 ? (
                        <QList list={this.state.qlist} app={this} />
                    ) : (
                        <ShowScore app={this} />
                    )}
                </div>
            </div>
        );
    }
}

function Menu({ app }) {
    return (
        <div className="text-center py-5">
            <h3 className="mb-4">🍩 มาดูกันว่าคุณรู้เกี่ยวกับขนมหวานมากแค่ไหน 🍩</h3>
            <button
                className="btn btn-primary btn-lg"
                onClick={() => app.setState({ status: 1 })}
            >
                🍰 Start Quiz 🍰
            </button>
        </div>
    );
}

function QList({ list, app }) {
    const valid = app.state.valid;

    return (
        <div>
            {list.map((q, i) => (
                <QBlock key={i} q={q} i={i} app={app} />
            ))}
            <div className="text-center mt-4">
                {valid ? (
                    <button
                        className="btn btn-success btn-lg shadow"
                        onClick={() => app.checkAnswer()}
                    >
                        🍭 Submit Answers 🍭
                    </button>
                ) : (
                    <p className="text-danger">❗ Please answer all questions</p>
                )}
            </div>
        </div>
    );
}

function QBlock({ i, q, app }) {
    const handleChange = (event) => {
        const { name, value } = event.target;
        const answers = { ...app.state.answers, [name]: value };
        app.setState({ answers }, () => app.validate());
    };

    return (
        <div className="mb-4 p-3 border rounded bg-light shadow-sm">
            <p>
                <strong>{i + 1}. </strong>
                <span dangerouslySetInnerHTML={{ __html: q.title }}></span>
            </p>
            {q.options.map((option, idx) => (
                <div key={idx}>
                    <label className="d-flex align-items-center">
                        <input
                            type="radio"
                            name={"q" + i}
                            value={idx + 1}
                            onChange={handleChange}
                            className="me-2"
                        />
                        {option}
                    </label>
                </div>
            ))}
        </div>
    );
}

function ShowScore({ app }) {
    return (
        <div className="text-center py-5">
            <h3 className="mb-4">🎉 Your Score: {app.state.score} 🍭</h3>
            <div className="mb-4">
                {app.state.qlist.map((q, i) => {
                    const selectedAnswer = app.state.answers["q" + i];
                    const correctAnswer = q.answer;
                    const answerClass =
                        selectedAnswer === correctAnswer
                            ? "text-success"
                            : "text-danger";
                    return (
                        <div key={i} className="mb-3">
                            <p>
                                <strong>{i + 1}. </strong>
                                <span dangerouslySetInnerHTML={{ __html: q.title }}></span>
                            </p>
                            <div>
                                <strong>Your answer: </strong>
                                <span
                                    className={answerClass}
                                >
                                    {q.options[selectedAnswer - 1]}
                                </span>
                            </div>
                            <div>
                                <strong>Correct answer: </strong>
                                <span className="text-success">
                                    {q.options[correctAnswer - 1]}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                className="btn btn-primary btn-lg shadow"
                onClick={() =>
                    app.setState({ status: 0, answers: {}, valid: false })
                }
            >
                🍪 Back to Menu 🍪
            </button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
