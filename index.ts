import express, { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import multer, { Multer, StorageEngine } from 'multer';
import { ParsedQs } from 'qs';
import { v4 as uuidv4 } from 'uuid';

interface Student {
  id: string;
  name: string;
  surname: string;
  email: string;
  age: number;
  imagePath?: string;
  groupId: string;
}

interface Group {
  id: string;
  name: string;
}

const app = express();
const port = 3000;


// Variables to store data
const students: Student[] = [];
const groups: Group[] = [];

// Get all students 
app.get('/students', (req: Request, res: Response) => {
  const studentsWithGroups = students.map(student => ({
    ...student,
    group: groups.find(group => group.id === student.groupId)
  }));
  res.json(studentsWithGroups);
});

// Get the student by id
app.get('/students/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const student = students.find(student => student.id === id);

  if (student) {
    const studentWithGroup = {
      ...student,
      group: groups.find(group => group.id === student.groupId)
    };
    res.json(studentWithGroup);
  } else {
    res.status(404).send('Student not found');
  }
});

// Add a student
app.post('/students', (req: Request, res: Response) => {
  const student: Student = req.body;
  student.id = uuidv4();
  students.push(student);
  res.send('Student added');
});


// Update student data
app.put('/students/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedStudent: Student = req.body;
  const index = students.findIndex(student => student.id === id);

  if (index !== -1) {
    students[index] = { ...students[index], ...updatedStudent };
    res.send('Student updated');
  } else {
    res.status(404).send('Student not found');
  }
});


// Delete the student
app.delete('/students/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const index = students.findIndex(student => student.id === id);

  if (index !== -1) {
    students.splice(index, 1);
    res.send('Student deleted');
  } else {
    res.status(404).send('Student not found');
  }
});


// Download the picture of the student
const storage: StorageEngine = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    const extension = file.originalname.split('.').pop();
    cb(null, uuidv4() + '.' + extension);
  }
});
const upload = multer({ storage: storage });

app.post('/students/:id/avatar', upload.single('avatar'), (req: Request, res: Response) => {
  const id = req.params.id;
  const imagePath = (req.file as Express.Multer.File)?.path; 
  const student = students.find(student => student.id === id);


  if (student) {
    student.imagePath = imagePath;
    res.send('Avatar uploaded');
  } else {
    res.status(404).send('Student not found');
  }
});


// Get the picture  of the student
app.get('/students/:id/avatar', (req: Request, res: Response) => {
  const id = req.params.id;
  const student = students.find(student => student.id === id);

  if (student && student.imagePath) {
    res.sendFile(__dirname + '/' + student.imagePath);
  } else {
    res.status(404).send('Avatar not found');
  }
});


// Add a group to the student
app.post('/students/:id/group', (req: Request, res: Response) => {
  const studentId = req.params.id;
  const groupId = req.body.groupId;
  const student = students.find(student => student.id === studentId);
  const group = groups.find(group => group.id === groupId);

  if (student && group) {
    student.groupId = groupId;
    res.send('Group added to student');
  } else {
    res.status(404).send('Student or group not found');
  }
});


// Get all groups 
app.get('/groups', (req: Request, res: Response) => {
  const groupsWithStudents = groups.map(group => ({
    ...group,
    students: students.filter(student => student.groupId === group.id)
  }));
  res.json(groupsWithStudents);
});

// Get the group by id 
app.get('/groups/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const group = groups.find(group => group.id === id);

  if (group) {
    const groupWithStudents = {
      ...group,
      students: students.filter(student => student.groupId === group.id)
    };
    res.json(groupWithStudents);
  } else {
    res.status(404).send('Group not found');
  }
});

// Add a group
app.post('/groups', (req: Request, res: Response) => {
  const group: Group = req.body;
  group.id = uuidv4();
  groups.push(group);
  res.send('Group added');
});


// Update group data
app.put('/groups/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedGroup: Group = req.body;
  const index = groups.findIndex(group => group.id === id);

  if (index !== -1) {
    groups[index] = { ...groups[index], ...updatedGroup };
    res.send('Group updated');
  } else {
    res.status(404).send('Group not found');
  }
});


// Delete the group
app.delete('/groups/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const index = groups.findIndex(group => group.id === id);

  if (index !== -1) {
    groups.splice(index, 1);
    res.send('Group deleted');
  } else {
    res.status(404).send('Group not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export function newFunction(req: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) {
  return req.file;
}