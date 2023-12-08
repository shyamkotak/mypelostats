import { Bar } from 'react-chartjs-2';

import WorkoutData from "../../interfaces/WorkoutData";
import { shuffle } from '@/libs/shuffle';


type TotalDistanceChartProps = {
    data: WorkoutData[];
};

function getDistancePerMonth(workouts: WorkoutData[]): {month: string, distance: number}[] {
    const distanceFrequency: { [month: string]: number } = {};

    workouts.forEach(workout => {
        const distance = workout['Distance (mi)'];
        const dateStr = workout['Workout Timestamp'].split(' ')[0];
        const date = new Date(dateStr);
        const monthIndex = date.getMonth(); // getMonth() returns a zero-based index of the month

        // Initialize the sum for the month if not already done
        if (!Object.prototype.hasOwnProperty.call(distanceFrequency, monthIndex)) {
            distanceFrequency[monthIndex] = 0;
        }

        // Add the length of the workout to the sum for the month
        distanceFrequency[monthIndex] += parseInt(distance, 10) || 0;
    });
    
    console.log(distanceFrequency)

    // Convert the frequency map to an array
    return Object.entries(distanceFrequency)
        .map(([month, distance]) => ({ month, distance }))
}

const TotalDistanceChart = (workoutData: TotalDistanceChartProps) => {
    const distancePerMonth = getDistancePerMonth(workoutData.data)
    const totalDistance = distancePerMonth.reduce((sum, current) => sum + current.distance, 0);

    const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const data = distancePerMonth.map(item => item.distance);

    const colorList = [
        'rgba(255, 99, 132, 0.6)', // Red
        'rgba(54, 162, 235, 0.6)', // Blue
        'rgba(75, 192, 192, 0.6)', // Green
        'rgba(255, 206, 86, 0.6)', // Yellow
        'rgba(255, 159, 64, 0.6)', // Orange
        'rgba(255, 105, 180, 0.6)', // Pink
    ]
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
                    label: (tooltipItem: any) => `${tooltipItem.parsed.y} miles`
                }
            },
        },
    };

    return (
        <section className="bg-gray-800">
            <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
            <div className="flex flex-col text-left basis-1/2">
                    <p className="inline-block font-semibold text-red-500 mb-4">Total Distance</p>
                    <p className="sm:text-4xl text-3xl font-extrabold text-white">
                        You travelled <span className="text-yellow-300">{totalDistance}</span> miles
                    </p>
                </div>
                <div className="flex-1">
                    <Bar key={Date.now() + crypto.randomUUID() } data={chartData} options={options} />
                </div>
            </div>
        </section>
    )
};

export default TotalDistanceChart;
