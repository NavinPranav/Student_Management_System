const fs = require('fs');
const express = require('express');
const e = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
app.use(cors({ origin: '*' }));
app.use(express.json());

const jsObjectData = () => {
  const data = fs.readFileSync('./students.json');
  const studentData = JSON.parse(data);
  return studentData;
};

const adminObjectData = () => {
  const data = fs.readFileSync('./admin.json');
  const adminData = JSON.parse(data);
  return adminData;
};

app.get('/', (req, res) => {
  const data = jsObjectData();
  res.send(data.Student);
});

const validation = (data) => {
  if (
    data.LastName !== '' &&
    data.FirstName !== '' &&
    data.City !== '' &&
    data.State !== '' &&
    data.Gender !== '' &&
    data.StudentStatus !== '' &&
    data.Major !== '' &&
    data.Country !== '' &&
    data.Age !== '' &&
    data.SAT !== '' &&
    data.Grade !== '' &&
    data.Height !== ''
  ) {
    return true;
  }
  return false;
};

app.get('/student/:id', (req, res) => {
  const data = jsObjectData();
  const filteredData = data.Student.find((student) => {
    return student.ID === req.params.id;
  });
  if (!filteredData) {
    res.status(404).send('Ther is no student of this id');
  }
  res.send(filteredData);
});

app.post('/student/create', (req, res) => {
  const data = jsObjectData();

  const newStudent = {
    ID: (data.Student.length + 1).toString(),
    LastName: req.body.LastName,
    FirstName: req.body.FirstName,
    City: req.body.City,
    State: req.body.State,
    Gender: req.body.Gender,
    StudentStatus: req.body.StudentStatus,
    Major: req.body.Major,
    Country: req.body.Country,
    Age: req.body.Age,
    SAT: req.body.SAT,
    Grade: req.body.Grade,
    Height: req.body.Height,
  };
  if (validation(newStudent)) {
    data.Student.push(newStudent);
    const insertData = { Student: data.Student };
    const newData = JSON.stringify(insertData);
    fs.writeFile('students.json', newData, (err) => {
      if (err) console.log(err);
      else res.send(data.Student);
    });
  } else {
    res.status(400).send('Invalid data');
  }
});

app.put('/student/edit/:id', (req, res) => {
  const data = jsObjectData();
  const filteredData = data.Student.find((student) => {
    return student.ID === req.params.id;
  });
  if (!filteredData) {
    res.status(404).send('Ther is no student of this id');
  } else {
    (filteredData.LastName = req.body.LastName),
      (filteredData.FirstName = req.body.FirstName),
      (filteredData.City = req.body.City),
      (filteredData.State = req.body.State),
      (filteredData.Gender = req.body.Gender),
      (filteredData.StudentStatus = req.body.StudentStatus),
      (filteredData.Major = req.body.Major),
      (filteredData.Country = req.body.Country),
      (filteredData.Age = req.body.Age),
      (filteredData.SAT = req.body.SAT),
      (filteredData.Grade = req.body.Grade),
      (filteredData.Height = req.body.Height);
  }

  if (validation(filteredData)) {
    const insertData = { Student: data.Student };
    const newData = JSON.stringify(insertData);
    fs.writeFile('students.json', newData, (err) => {
      if (err) console.log(err);
      else res.send(data.Student);
    });
  } else {
    res.status(400).send('Invalid data');
  }
});

app.delete('/student/delete/:id', (req, res) => {
  const data = jsObjectData();
  const delData = data.Student.filter((student) => {
    return student.ID !== req.params.id;
  });
  const insertData = { Student: delData };
  const newData = JSON.stringify(insertData);
  fs.writeFile('students.json', newData, (err) => {
    if (err) console.log(err);
    else res.send(data.Student);
  });
});

app.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const admin = { email: req.body.email, password: hashedPassword };

    const data = adminObjectData();

    data.push(admin);

    fs.writeFile('./admin.json', JSON.stringify(data), (err) => {
      if (err) res.send('Cannot register');
      else res.send({ token: 'asdqwe123' });
    });
  } catch {
    res.status(500);
  }
});

app.post('/login', async (req, res) => {
  const data = adminObjectData();
  const filteredData = data.filter((admin) => {
    return admin.email === req.body.email;
  });
  if (filteredData.length === 0) {
    return res.status(400).send('Email ID incorrect');
  }
  try {
    if (await bcrypt.compare(req.body.password, filteredData[0].password)) {
      res.setHeader('token', 'asdqwe1254');
      res.status(200).send({ token: '1234qwe' });
    } else {
      res.send('Password Incorrect');
    }
  } catch {
    res.status(500).send('Incorrect username or password');
  }
});

app.listen(3000, console.log('listening on port 3000'));
