'use client';

import FAQ from "@/components/FAQ";
import React, { useState } from 'react';
import Papa from 'papaparse';
import 'chart.js/auto';

import WorkoutData from "../interfaces/WorkoutData";
import WorkoutMinutesChart from './charts/WorkoutMinutesChart';
import FavoriteInstructorsChart from './charts/FavoriteInstructorsChart';
import FavoriteDisciplinesChart from './charts/FavoriteDisciplinesChart';
import TotalDistanceChart from './charts/TotalDistanceChart';
import FavoriteTimeOfDayChart from './charts/FavoriteTimeOfDayChart';

const WorkoutStats = () => {
    const [uploadedData, setUploadedData] = useState<WorkoutData[]>([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            Papa.parse(file, {
                complete: (result) => {
                    const filteredData: WorkoutData[] = (result.data as WorkoutData[]).filter((row: WorkoutData) => {
                        if (row['Workout Timestamp']) {
                            // Extract the date part and convert to a Date object
                            const dateStr = row['Workout Timestamp'].split(' ')[0];
                            const date = new Date(dateStr);
    
                            // Create a Date object for January 1, 2023
                            const startDate = new Date('2023-01-01');
                            const endDate = new Date('2024-01-01')
    
                            // Check if the workout date is on or after January 1, 2023
                            return date >= startDate && date < endDate;
                        }
                        return false;
                    });

                    setUploadedData(
                        filteredData
                    );
                    setIsFileUploaded(true);
                },
                header: true
            });
        } else {
            alert("Please upload a CSV file.");
        }
    };

    return (
        <div>
            {!isFileUploaded && (
                <section className="bg-base-200">
                    <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
                        <div className="flex flex-col text-left basis-1/2">
                            <h2 className="text-4xl font-bold text-primary mb-4">Get Started</h2>
                            <p className="text-3xl font-semibold text-base-content mb-2">
                                See your 2023 Peloton Year-In-Review
                            </p>
                            <ul className="list-disc list-inside sm:text-lg text-base text-base-content">
                                <li>Go to members.onepeloton.com</li>
                                <li>Go to Profile -{'>'} Workouts</li>
                                <li>Click on &quot;Download Your Workouts&quot;</li>
                                <li>Upload and enjoy!</li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                            </label>
                        </div>
                    </div>
                </section>
            )}

            {!isFileUploaded && (
                <FAQ />
            )}

            {isFileUploaded && uploadedData.length > 0 && (
                <WorkoutMinutesChart data={uploadedData}/>
            )}
            {isFileUploaded && uploadedData.length > 0 && (
                <FavoriteInstructorsChart data={uploadedData}/>
            )}
            {isFileUploaded && uploadedData.length > 0 && (
                <FavoriteDisciplinesChart data={uploadedData}/>
            )}
            {isFileUploaded && uploadedData.length > 0 && (
                <TotalDistanceChart data={uploadedData}/>
            )}
            {isFileUploaded && uploadedData.length > 0 && (
                <FavoriteTimeOfDayChart data={uploadedData}/>
            )}
            {isFileUploaded && uploadedData.length > 0 && (
                <section className="bg-gray-800" id="nextyear">
                    <div className="py-24 px-8 max-w-7xl mx-auto flex justify-center items-center">
                        <div className="text-center">
                            <p className="text-4xl font-extrabold text-white">
                                You crushed 2023! Can&apos;t wait to see what you accomplish in 2024 💪
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default WorkoutStats;
