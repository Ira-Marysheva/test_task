/****************************************************************
Описание
	Вам дается квадратная сетка с обычными `.` и заблокированными `X` ячейками. 
  Ваша игровая фигура может перемещаться по любой строке или столбцу или диагонали, пока не достигнет края сетки или заблокированной ячейки. 
  Учитывая сетку, начальную и конечную позиции, постройте кратчайший путь, чтобы добраться до конечной позиции.

Например
	Дана сетка:
  .X.
  .X.
  ...

  Система координаты для данной сетки:
  0.0 0.1 0.2
  1.0 1.1	1.2
  2.0	2.1	2.2

  Начальна позиция 2.1 (отсчет идет с верхнего левого края сетки 0.0)
  Конечная позиция 0.2

  Путь движения между начальной и конечной точкой: (2.1) -> (1.2) -> (0.2)
  Ответ: [{x:2, y:1}, {x:1, y:2}, {x:0, y:2}]

	Задача
  	Завершите выполнение функции в редакторе. Функция должена вывести массив объектов координат которые обеспечивают минимальное количество шагов для перехода от начальной позиции к конечной и порядок массива соответвует движения по координатам.

  Ограничения
  	Длина сетки > 1 и < 100
    Координата начальной и конечной точки входит в предоставленную сетку.
    Задача должна быть решена с использованием ООП
    Плюсом будет использоватие TypeScript
  	
****************************************************************/
type PointType = {
    x: number;
    y: number;
    path?: PointType[]; // Поле для зберігання шляху
};

// абстракція
abstract class Point {
  //інкапсуляція
    protected gridList: string[]; // Вхідний масив рядків
    protected parsedGridList: string[][]; // Масив масивів символів
    protected start: PointType;
    protected end: PointType;

    constructor(gridList: string[], start: PointType, end: PointType) {
        this.gridList = gridList;
        this.parsedGridList = gridList.map((row) => row.split(''));
        this.start = { ...start, path: [start] };
        this.end = { ...end, path: [] };
    }
    public abstract runner(): PointType[];
}

//наслідування
class Points extends Point {
    constructor(gridList: string[], start: PointType, end: PointType) {
        super(gridList, start, end);
    }

    // поліморфізм
    public runner(): PointType[] {
        const queue: PointType[] = [{ ...this.start, path: [this.start] }]; // Ініціалія черги
        const visited: PointType[] = []; //  Відвідані точки

        while (queue.length > 0) {
            const point = queue.shift();
            if (!point) continue; 
            if (point.x === this.end.x && point.y === this.end.y) {
                return point.path?.map(p => ({ x: p.x, y: p.y })); 
            }
            // Перевірка, чи була точка вже відвідана
            const isVisited = visited.some((p) => p.x === point.x && p.y === point.y);
            if (isVisited) continue; // Пропускаємо вже відвідані точки
            visited.push(point); // Додаємо точку до масиву відвіданих

            this.findNeighbors(point, queue, visited);
        }

        return []; // Якщо шлях не знайдено
    }

    private findNeighbors(point: PointType, queue: PointType[], visited: PointType[]): void {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Пропускаємо саму точку

                const newX = point.x + i;
                const newY = point.y + j;

                // Перевірка меж сітки
                if (newX >= 0 && newX < this.gridList.length && newY >= 0 && newY < this.gridList[0].length) {
                    // Пропускаємо перешкоди
                    if (this.gridList[newX][newY] === 'X') continue;

                    // const key = `${newX},${newY}`;
                    // Перевіряємо, чи точка вже відвідана
                    const isVisited = visited.some((p) => p.x === newX && p.y === newY);
                    if (!isVisited) {
                        queue.push({
                            x: newX,
                            y: newY,
                            path: [...(point.path || []), { x: newX, y: newY }],
                        });
                    }
                }
            }
        }
    }
}

// Використання класу Point
const result = new Points(
    [
        '.X.',
        '.X.',
        '...',
    ],
    { x: 2, y: 1 },
    { x: 0, y: 2 }
).runner();

console.log(result); // [{x:2, y:1}, {x:1, y:2}, {x:0, y:2}]
