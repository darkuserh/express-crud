"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFunction = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3000;
// Variables to store data
const students = [];
const groups = [];
// Get all students 
app.get('/students', (req, res) => {
    const studentsWithGroups = students.map(student => (Object.assign(Object.assign({}, student), { group: groups.find(group => group.id === student.groupId) })));
    res.json(studentsWithGroups);
});
// Get the student by id
app.get('/students/:id', (req, res) => {
    const id = req.params.id;
    const student = students.find(student => student.id === id);
    if (student) {
        const studentWithGroup = Object.assign(Object.assign({}, student), { group: groups.find(group => group.id === student.groupId) });
        res.json(studentWithGroup);
    }
    else {
        res.status(404).send('Student not found');
    }
});
// Add a student
app.post('/students', (req, res) => {
    const student = req.body;
    student.id = (0, uuid_1.v4)();
    students.push(student);
    res.send('Student added');
});
// Update student data
app.put('/students/:id', (req, res) => {
    const id = req.params.id;
    const updatedStudent = req.body;
    const index = students.findIndex(student => student.id === id);
    if (index !== -1) {
        students[index] = Object.assign(Object.assign({}, students[index]), updatedStudent);
        res.send('Student updated');
    }
    else {
        res.status(404).send('Student not found');
    }
});
// Delete the student
app.delete('/students/:id', (req, res) => {
    const id = req.params.id;
    const index = students.findIndex(student => student.id === id);
    if (index !== -1) {
        students.splice(index, 1);
        res.send('Student deleted');
    }
    else {
        res.status(404).send('Student not found');
    }
});
// Download the picture of the student
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        cb(null, (0, uuid_1.v4)() + '.' + extension);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.post('/students/:id/avatar', upload.single('avatar'), (req, res) => {
    var _a;
    const id = req.params.id;
    const imagePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const student = students.find(student => student.id === id);
    if (student) {
        student.imagePath = imagePath;
        res.send('Avatar uploaded');
    }
    else {
        res.status(404).send('Student not found');
    }
});
// Get the picture  of the student
app.get('/students/:id/avatar', (req, res) => {
    const id = req.params.id;
    const student = students.find(student => student.id === id);
    if (student && student.imagePath) {
        res.sendFile(__dirname + '/' + student.imagePath);
    }
    else {
        res.status(404).send('Avatar not found');
    }
});
// Add a group to the student
app.post('/students/:id/group', (req, res) => {
    const studentId = req.params.id;
    const groupId = req.body.groupId;
    const student = students.find(student => student.id === studentId);
    const group = groups.find(group => group.id === groupId);
    if (student && group) {
        student.groupId = groupId;
        res.send('Group added to student');
    }
    else {
        res.status(404).send('Student or group not found');
    }
});
// Get all groups 
app.get('/groups', (req, res) => {
    const groupsWithStudents = groups.map(group => (Object.assign(Object.assign({}, group), { students: students.filter(student => student.groupId === group.id) })));
    res.json(groupsWithStudents);
});
// Get the group by id 
app.get('/groups/:id', (req, res) => {
    const id = req.params.id;
    const group = groups.find(group => group.id === id);
    if (group) {
        const groupWithStudents = Object.assign(Object.assign({}, group), { students: students.filter(student => student.groupId === group.id) });
        res.json(groupWithStudents);
    }
    else {
        res.status(404).send('Group not found');
    }
});
// Add a group
app.post('/groups', (req, res) => {
    const group = req.body;
    group.id = (0, uuid_1.v4)();
    groups.push(group);
    res.send('Group added');
});
// Update group data
app.put('/groups/:id', (req, res) => {
    const id = req.params.id;
    const updatedGroup = req.body;
    const index = groups.findIndex(group => group.id === id);
    if (index !== -1) {
        groups[index] = Object.assign(Object.assign({}, groups[index]), updatedGroup);
        res.send('Group updated');
    }
    else {
        res.status(404).send('Group not found');
    }
});
// Delete the group
app.delete('/groups/:id', (req, res) => {
    const id = req.params.id;
    const index = groups.findIndex(group => group.id === id);
    if (index !== -1) {
        groups.splice(index, 1);
        res.send('Group deleted');
    }
    else {
        res.status(404).send('Group not found');
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
function newFunction(req) {
    return req.file;
}
exports.newFunction = newFunction;
