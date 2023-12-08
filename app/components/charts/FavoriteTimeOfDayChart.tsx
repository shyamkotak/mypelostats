import { Bar } from 'react-chartjs-2';

import WorkoutData from "../../interfaces/WorkoutData";
import { shuffle } from '@/libs/shuffle';


type FavoriteTimeOfDayChartProps = {
    data: WorkoutData[];
};


function getTopTimesOfDay(workouts: WorkoutData[]): {time: string, count: number}[] {
    const timeFrequency: { [instructor: string]: number } = {};

    workouts.forEach(workout => {
        const workoutTimestamp = workout['Workout Timestamp']; // "2021-07-30 17:39 (-04)"

        console.log(workoutTimestamp)

        const dateTimePart = workoutTimestamp.substring(0, 16); // Extracting "YYYY-MM-DD HH:MM"
        const timeZonePart = workoutTimestamp.substring(17); // Extracting the timezone part "(IST)" or "-04"

        const [datePart, timePart] = dateTimePart.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        let date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        if (timeZonePart.includes('(')) {
            // Handling named time zones
            const timeZoneAbbr = timeZonePart.match(/\(([^)]+)\)/)[1];
            const offset = timeZoneOffsets[timeZoneAbbr];
            if (offset !== undefined) {
                date.setUTCHours(date.getUTCHours() - offset);
            }
        } else {
            // Handling fixed time zone offsets
            const offsetSign = timeZonePart[0] === '-' ? -1 : 1;
            const offsetHours = parseInt(timeZonePart, 10);
            date.setUTCHours(date.getUTCHours() + offsetSign * offsetHours);
        }

        let hour = date.getHours();
        const ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12;
        hour = hour ? hour : 12; // the hour '0' should be '12'

        const time = hour + ampm;

        if (time) {
            timeFrequency[time] = (timeFrequency[time] || 0) + 1;
        }
    });

    // Convert the frequency map to an array, sort it, and slice the top 5
    return Object.entries(timeFrequency)
        .map(([time, count]) => ({ time, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

const FavoriteTimeOfDayChart = (workoutData: FavoriteTimeOfDayChartProps) => {
    const favoriteTimes = getTopTimesOfDay(workoutData.data)
    const favoriteTime = favoriteTimes[0].time

    const labels = favoriteTimes.map(item => item.time);
    const data = favoriteTimes.map(item => item.count);

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
                    label: (tooltipItem: any) => `${tooltipItem.parsed.y} workouts`
                }
            },
        },
    };

    return (
        <section className="bg-gray-800">
            <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
            <div className="flex flex-col text-left basis-1/2">
                    <p className="inline-block font-semibold text-red-500 mb-4">Favorite Time To Workout</p>
                    <p className="sm:text-4xl text-3xl font-extrabold text-white">
                        And you loved working out at <span className="text-yellow-300">{favoriteTime}</span>
                    </p>
                </div>
                <div className="flex-1">
                    <Bar key={Date.now() + crypto.randomUUID() } data={chartData} options={options} />
                </div>
            </div>
        </section>
    )
};

const timeZoneOffsets: { [key: string]: number } = {
    'IST': 5.5, // Indian Standard Time
    'UTC': 0, // Coordinated Universal Time
    'GMT': 0, // Greenwich Mean Time
    'EST': -5, // Eastern Standard Time (North America)
    'EDT': -4, // Eastern Daylight Time (North America)
    'CST': -6, // Central Standard Time (North America)
    'CDT': -5, // Central Daylight Time (North America)
    'MST': -7, // Mountain Standard Time (North America)
    'MDT': -6, // Mountain Daylight Time (North America)
    'PST': -8, // Pacific Standard Time (North America)
    'PDT': -7, // Pacific Daylight Time (North America)
    'BST': 1, // British Summer Time
    'CEST': 2, // Central European Summer Time
    'CET': 1, // Central European Time
    'EET': 2, // Eastern European Time
    'EEST': 3, // Eastern European Summer Time
    'JST': 9, // Japan Standard Time
    'AEST': 10, // Australian Eastern Standard Time
    'AEDT': 11, // Australian Eastern Daylight Time
    'NZST': 12, // New Zealand Standard Time
    'NZDT': 13, // New Zealand Daylight Time
    // ... more time zones ...
};

export default FavoriteTimeOfDayChart;
