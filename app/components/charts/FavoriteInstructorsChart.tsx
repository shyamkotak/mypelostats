import { Bar } from 'react-chartjs-2';

import WorkoutData from "../../interfaces/WorkoutData";
import { shuffle } from '@/libs/shuffle';


type FavoriteInstructorsChartProps = {
    data: WorkoutData[];
};

function getTopFiveInstructors(workouts: WorkoutData[]): {instructor: string, count: number}[] {
    const instructorFrequency: { [instructor: string]: number } = {};

    workouts.forEach(workout => {
        const instructor = workout['Instructor Name'];
        if (instructor) {
            instructorFrequency[instructor] = (instructorFrequency[instructor] || 0) + 1;
        }
    });

    // Convert the frequency map to an array, sort it, and slice the top 5
    return Object.entries(instructorFrequency)
        .map(([instructor, count]) => ({ instructor, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

const FavoriteInstructorsChart = (workoutData: FavoriteInstructorsChartProps) => {
    const favoriteInstructors = getTopFiveInstructors(workoutData.data)
    const favoriteInstructor = favoriteInstructors[0].instructor

    const labels = favoriteInstructors.map(item => item.instructor);
    const data = favoriteInstructors.map(item => item.count);

    const colorList = [
        'rgba(255, 0, 102, 0.7)',
        'rgba(0, 191, 255, 0.7)',
        'rgba(0, 255, 127, 0.7)',
        'rgba(255, 255, 0, 0.7)',
        'rgba(255, 165, 0, 0.7)',
        'rgba(255, 20, 147, 0.7)',
    ];
    const shuffledColors = shuffle(colorList)

    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: shuffledColors,
            borderColor: shuffledColors,
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
                    <p className="inline-block font-semibold text-red-500 mb-4">Favorite Instructors</p>
                    <p className="sm:text-4xl text-3xl font-extrabold text-white">
                        Your favorite instructor was <span className="text-yellow-300">{favoriteInstructor}</span>
                    </p>
                </div>
                <div className="flex-1">
                    <Bar key={Date.now() + crypto.randomUUID() } data={chartData} options={options} />
                </div>
            </div>
        </section>
    )
};

export default FavoriteInstructorsChart;
