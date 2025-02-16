const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

class App extends React.Component {
    title = (
        <Alert variant="info" className="text-center">
            <b>Work6:</b> Firebase
        </Alert>
    );
    footer = (
        <div className="text-center mt-4">
            By 653380133-3 นางสาวนภสร สุบงกช <br />
            College of Computing, Khon Kaen University
        </div>
    );
    state = {
        scene: 0,
        students: [],
        stdid: "",
        stdtitle: "",
        stdfname: "",
        stdlname: "",
        stdemail: "",
        stdphone: "",
        user: null,
    };
    render() {
        return (
            <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                <Card.Header className="bg-primary text-white text-center">
                    {this.title}
                </Card.Header>
                <Card.Body>
                    <LoginBox user={this.state.user} app={this} />
                    <div className="text-center mb-3">
                        <Button onClick={() => this.readData()} variant="outline-info" className="mx-2">
                            Read Data
                        </Button>
                        <Button onClick={() => this.autoRead()} variant="outline-success" className="mx-2">
                            Auto Read
                        </Button>
                    </div>
                    <StudentTable data={this.state.students} app={this} />
                </Card.Body>
                <Card.Footer className="bg-light">
                    <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br />
                    <div className="d-flex flex-wrap justify-content-between">
                        <TextInput label="ID" app={this} value="stdid" style={{ width: 120 }} />
                        <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{ width: 100 }} />
                        <TextInput label="ชื่อ" app={this} value="stdfname" style={{ width: 120 }} />
                        <TextInput label="สกุล" app={this} value="stdlname" style={{ width: 120 }} />
                        <TextInput label="Email" app={this} value="stdemail" style={{ width: 150 }} />
                        <TextInput label="Phone" app={this} value="stdphone" style={{ width: 120 }} />
                    </div>
                    <div className="text-center mt-3">
                        <Button onClick={() => this.insertData()} variant="primary">
                            Save
                        </Button>
                    </div>
                </Card.Footer>
                <Card.Footer className="text-center">{this.footer}</Card.Footer>
            </Card>
        );
    }

    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            console.log(stdlist);
            this.setState({ students: stdlist });
        });
    }

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    insertData() {
        db.collection("students").doc(this.state.stdid).set({
            title: this.state.stdtitle,
            fname: this.state.stdfname,
            lname: this.state.stdlname,
            phone: this.state.stdphone,
            email: this.state.stdemail,
        });
    }

    edit(std) {
        this.setState({
            stdid: std.id,
            stdtitle: std.title,
            stdfname: std.fname,
            stdlname: std.lname,
            stdemail: std.email,
            stdphone: std.phone,
        });
    }

    delete(std) {
        if (confirm("ต้องการลบข้อมูล")) {
            db.collection("students").doc(std.id).delete();
        }
    }

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
            } else {
                this.setState({ user: null });
            }
        });
    }

    google_login() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider);
    }

    google_logout() {
        if (confirm("Are you sure?")) {
            firebase.auth().signOut();
        }
    }
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBpwp8ZeWziTiiMhy6J7ujHJ9vl0_0oSWw",
    authDomain: "web2567-napasornsu.firebaseapp.com",
    projectId: "web2567-napasornsu",
    storageBucket: "web2567-napasornsu.firebasestorage.app",
    messagingSenderId: "395835196525",
    appId: "1:395835196525:web:e9d5329f7432df5b162b64",
    measurementId: "G-J7CZRX16TW"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Student Table
function StudentTable({ data, app }) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>รหัส</th>
                    <th>คำนำหน้า</th>
                    <th>ชื่อ</th>
                    <th>สกุล</th>
                    <th>email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((s) => (
                    <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.title}</td>
                        <td>{s.fname}</td>
                        <td>{s.lname}</td>
                        <td>{s.email}</td>
                        <td>
                            <EditButton std={s} app={app} />
                            <DeleteButton std={s} app={app} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

function TextInput({ label, app, value, style }) {
    return (
        <div className="mb-3">
            <label className="form-label">{label}:</label>
            <input
                className="form-control"
                style={style}
                value={app.state[value]}
                onChange={(ev) => {
                    var s = {};
                    s[value] = ev.target.value;
                    app.setState(s);
                }}
            />
        </div>
    );
}

function EditButton({ std, app }) {
    return (
        <Button
            variant="warning"
            size="sm"
            className="mx-1"
            onClick={() => app.edit(std)}
        >
            แก้ไข
        </Button>
    );
}

function DeleteButton({ std, app }) {
    return (
        <Button
            variant="danger"
            size="sm"
            className="mx-1"
            onClick={() => app.delete(std)}
        >
            ลบ
        </Button>
    );
}

function LoginBox(props) {
    const u = props.user;
    const app = props.app;
    if (!u) {
        return (
            <div className="text-center mb-3">
                <Button onClick={() => app.google_login()} variant="primary">
                    Login with Google
                </Button>
            </div>
        );
    } else {
        return (
            <div className="text-center mb-3">
                <img src={u.photoURL} alt="user" className="rounded-circle" width="50" />
                <p>{u.email}</p>
                <Button onClick={() => app.google_logout()} variant="danger">
                    Logout
                </Button>
            </div>
        );
    }
}
