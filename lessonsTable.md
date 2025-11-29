Ниже я подготовил **готовый React + MUI компонент**, который принимает твой JSON и автоматически строит таблицу «Уроки × Классы» — в том виде, как на скриншоте (с чек-иконками в ячейках, цветами по классам и т.д.).

Ты можешь просто вставить компонент в проект.

---

# ✅ **Готовый React + MUI компонент**

### `LessonsTable.jsx`

```jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Пример: ты подставишь сюда свой JSON
// lessonsData[subject][classNumber] = true/false
const lessonsData = {
  "Математика":        {"1": true, "2": true, "3": true, "4": true, "5": true, "6": true, "7": true, "8": true, "9": true, "10": true, "11": true},
  "Геометрия":         {"1": false,"2": false,"3": false,"4": false,"5": false,"6": false,"7": true,"8": true,"9": true,"10": true,"11": true},
  "Алгебра":           {"1": false,"2": false,"3": false,"4": false,"5": false,"6": false,"7": true,"8": true,"9": true,"10": true,"11": true},
  "Русский язык":      {"1": true,"2": true,"3": true,"4": true,"5": true,"6": true,"7": true,"8": true,"9": true,"10": true,"11": true},
  "Английский язык":   {"1": true,"2": true,"3": true,"4": true,"5": true,"6": true,"7": true,"8": true,"9": true,"10": true,"11": true},
  "Физика":            {"1": false,"2": false,"3": false,"4": false,"5": true,"6": true,"7": true,"8": true,"9": true,"10": true,"11": true},
  "Химия":             {"1": false,"2": false,"3": false,"4": false,"5": false,"6": false,"7": true,"8": true,"9": true,"10": true,"11": true},
  "Литература":        {"1": true,"2": true,"3": true,"4": true,"5": true,"6": true,"7": true,"8": true,"9": true,"10": true,"11": true},
  "История":           {"1": false,"2": false,"3": false,"4": false,"5": true,"6": true,"7": true,"8": true,"9": true,"10": true,"11": true},
  "География":         {"1": false,"2": false,"3": false,"4": false,"5": true,"6": true,"7": true,"8": true,"9": true,"10": true,"11": true},
  "Окружающий мир":    {"1": true,"2": true,"3": true,"4": true,"5": false,"6": false,"7": false,"8": false,"9": false,"10": false,"11": false}
};

// цвета для классов
const classColors = [
  "#e53935", "#fb8c00", "#fdd835", "#43a047", "#26a69a",
  "#42a5f5", "#8e24aa", "#ef5350", "#ffa726", "#d4e157", "#66bb6a"
];

export default function LessonsTable({ data = lessonsData }) {
  const classNumbers = Object.keys(Object.values(data)[0]); // ["1"..."11"]
  const subjects = Object.keys(data);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {classNumbers.map((cls, index) => (
              <TableCell key={cls} align="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: classColors[index] }}>
                  {cls}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject}>
              <TableCell sx={{ fontWeight: 600, fontSize: 16 }}>
                {subject}
              </TableCell>

              {classNumbers.map((cls, index) => (
                <TableCell key={cls} align="center">
                  {data[subject][cls] && (
                    <CheckCircleOutlineIcon sx={{ color: classColors[index] }} />
                  )}
                </TableCell>
              ))}

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

---

# 📌 Как использовать

1. Положи компонент в `src/components/LessonsTable.jsx`
2. Импортируй в страницу:

```jsx
import LessonsTable from "./components/LessonsTable";

export default function Page() {
  return <LessonsTable />;
}
```

3. Чтобы использовать **твои реальные данные**, просто передай их пропом:

```jsx
<LessonsTable data={myJsonData} />
```

---

# 🎨 Визуально будет выглядеть точно как на твоём скриншоте:

* слева — названия уроков
* сверху — номера классов
* в ячейках — цветные кружочки-чекбоксы
* цвета циклично повторяются для классов

---

Также сделай адаптивную версию для мобильных
