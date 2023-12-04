import { Bar } from 'react-chartjs-2';

import WorkoutData from "../../interfaces/WorkoutData";


type FavoriteDisciplinesChartProps = {
    data: WorkoutData[];
};

function getTopFiveDisciplines(workouts: WorkoutData[]): {discipline: string, count: number}[] {
    const disciplineFrequency: { [discipline: string]: number } = {};

    workouts.forEach(workout => {
        const discipline = workout['Fitness Discipline'];
        if (discipline) {
            disciplineFrequency[discipline] = (disciplineFrequency[discipline] || 0) + 1;
        }
    });

    // Convert the frequency map to an array, sort it, and slice the top 5
    return Object.entries(disciplineFrequency)
        .map(([discipline, count]) => ({ discipline, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

function getTopClassTypeForDiscipline(workouts: WorkoutData[], favoriteDiscipline: String): String {
    const classTypeFrequency: { [classType: string]: number } = {};
    
    workouts.forEach(workout => {
        const workoutDiscipline = workout['Fitness Discipline'];
        const classType =  workout['Type']
        if (workoutDiscipline == favoriteDiscipline && classType != "") {
            classTypeFrequency[classType] = (classTypeFrequency[classType] || 0) + 1;
        }
    });

    // Convert the frequency map to an array, sort it, and slice the top 5
    const favoriteClassTypes = Object.entries(classTypeFrequency)
        .map(([classType, count]) => ({ classType, count }))
        .sort((a, b) => b.count - a.count)

    return favoriteClassTypes[0].classType
}

const FavoriteDisciplinesChart = (workoutData: FavoriteDisciplinesChartProps) => {
    const favoriteDisciplines = getTopFiveDisciplines(workoutData.data)
    const favoriteDiscipline = favoriteDisciplines[0].discipline
    const favoriteClassType = getTopClassTypeForDiscipline(
        workoutData.data,
        favoriteDiscipline
    )

    const labels = favoriteDisciplines.map(item => item.discipline);
    const data = favoriteDisciplines.map(item => item.count);

    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // Red
                'rgba(54, 162, 235, 0.6)', // Blue
                'rgba(75, 192, 192, 0.6)', // Green
                'rgba(255, 206, 86, 0.6)', // Yellow
                'rgba(255, 159, 64, 0.6)', // Orange
                'rgba(255, 105, 180, 0.6)', // Pink
                // ... add more colors for remaining months ...
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)', // Red
                'rgba(54, 162, 235, 1)', // Blue
                'rgba(75, 192, 192, 1)', // Green
                'rgba(255, 206, 86, 1)', // Yellow
                'rgba(255, 159, 64, 1)', // Orange
                'rgba(255, 105, 180, 1)', // Pink
                // ... add more colors for remaining months ...
            ],
            borderWidth: 2,
            hoverBorderColor: 'rgba(0, 0, 0, 1)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: '#ffffff',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#ffffff',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    size: 16,
                },
                bodyFont: {
                    size: 14,
                },
                callbacks: {
                    label: (tooltipItem: any) => `${tooltipItem.parsed.y} workouts`
                }
            },
        },
    };

    return (
        <section className="bg-gray-800">
            <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
            <div className="flex flex-col text-left basis-1/2">
                    <p className="inline-block font-semibold text-red-500 mb-4">Favorite Discipline</p>
                    <p className="sm:text-4xl text-3xl font-extrabold text-white">
                        Your favorite discipline was {favoriteDiscipline} with a class type of {favoriteClassType}
                    </p>
                </div>
                <div className="flex-1">
                    <Bar key={Date.now() + crypto.randomUUID() } data={chartData} options={options} />
                </div>
            </div>
        </section>
    )
};

export default FavoriteDisciplinesChart;
