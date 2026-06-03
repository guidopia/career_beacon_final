import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react';
import {
    AcademicCapIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    ChevronDownIcon,
    CheckIcon,
    ArrowRightIcon,
    MapIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';
import { getUserProfile } from '../api/user';
import { apiAxios } from '../api';
import { SITE_BRAND_NAME } from '../constants/branding';

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        degreeType: '',
        field: '',
        customField: '',
        budget: '',
        countries: '',
        indiaState: '',
        duration: '',
        needScholarship: false,
        // New academic performance fields
        academicPercentage: '',
        academicBoard: '',
        entranceScores: '',
        currentClass: ''
    });

    // Options data
    const degreeOptions = [
        { id: 'Undergraduate', name: 'Undergraduate' },
        { id: 'Postgraduate', name: 'Postgraduate (Masters)' },
        { id: 'PhD', name: 'PhD' }
    ];

    const fieldOptions = [
        { id: 'Engineering', name: 'Engineering' },
        { id: 'Medical', name: 'Medical' },
        { id: 'Business', name: 'Business' },
        { id: 'Computer Science', name: 'Computer Science' },
        { id: 'Arts', name: 'Arts' },
        { id: 'Science', name: 'Science' },
        { id: 'Law', name: 'Law' },
        { id: 'Architecture', name: 'Architecture' },
        { id: 'Design', name: 'Design' },
        { id: 'custom', name: 'Other (specify below)' }
    ];

    const budgetOptions = [
        { id: 'Government/Public institutions (Lower fees)', name: 'Government/Public (Lower fees)' },
        { id: 'Private institutions (Higher fees)', name: 'Private (Higher fees)' },
        { id: 'No preference (All types)', name: 'No preference (All types)' }
    ];

    const durationOptions = [
        { id: '', name: 'No Preference' },
        { id: '1-2 years', name: '1-2 years' },
        { id: '3-4 years', name: '3-4 years' },
        { id: '4+ years', name: '4+ years' }
    ];

    // New academic options
    const boardOptions = [
        { id: 'CBSE', name: 'CBSE' },
        { id: 'ICSE', name: 'ICSE' },
        { id: 'State Board', name: 'State Board' },
        { id: 'IB', name: 'International Baccalaureate (IB)' },
        { id: 'A-Levels', name: 'A-Levels' },
        { id: 'Other', name: 'Other' }
    ];

    const currentClassOptions = [
        { id: 'Class 6-9', name: 'Class 6-9' },
        { id: 'Class 10', name: 'Class 10' },
        { id: 'Class 11', name: 'Class 11' },
        { id: 'Class 12 (Current)', name: 'Class 12 (Current Year)' },
        { id: 'Class 12 (Completed)', name: 'Class 12 (Completed)' },
        { id: 'Undergraduate (Current)', name: 'Undergraduate (Current)' },
        { id: 'Undergraduate (Completed)', name: 'Undergraduate (Completed)' },
        { id: 'Postgraduate (Current)', name: 'Postgraduate (Current)' },
        { id: 'Postgraduate (Completed)', name: 'Postgraduate (Completed)' }
    ];

    // Indian states list
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
        'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
        'Uttarakhand', 'West Bengal', 'Jammu and Kashmir', 'Ladakh',
        'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
        'Puducherry', 'Andaman and Nicobar Islands'
    ].map(state => ({ id: state, name: state }));

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateAcademicPercentage = (percentage) => {
        const num = parseFloat(percentage);
        return !isNaN(num) && num >= 0 && num <= 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.degreeType || !formData.field || !formData.budget || !formData.academicPercentage || !formData.currentClass) {
            alert('Please fill in all required fields to get your recommendations');
            return;
        }

        // Validate academic percentage
        if (!validateAcademicPercentage(formData.academicPercentage)) {
            alert('Please enter a valid percentage between 0 and 100');
            return;
        }

        // If custom field is selected, check if it's filled
        if (formData.field === 'custom' && !formData.customField) {
            alert('Please specify your field of study');
            return;
        }

        setLoading(true);

        try {
            // Process the field data and combine country with state if India is selected
            const finalFormData = {
                ...formData,
                field: formData.field === 'custom' ? formData.customField : formData.field,
                countries: formData.countries.toLowerCase().includes('india') && formData.indiaState
                    ? `${formData.countries}, ${formData.indiaState}`
                    : formData.countries,
                academicPercentage: parseFloat(formData.academicPercentage)
            };

            // Log the search action (non-blocking)
            getUserProfile().then(res => {
                const username = res?.data?.name;
                if (username) {
                    apiAxios('/api/user/activity', {
                        method: 'POST',
                        data: {
                            message: `${username} searched for colleges`,
                            timestamp: new Date().toISOString()
                        }
                    }).catch(() => {});
                }
            }).catch(() => {});

            window.userPreferences = finalFormData;
            navigate('/explore');
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Check if India is selected in countries field
    const isIndiaSelected = formData.countries.toLowerCase().includes('india');

    // Custom Select Component
    const CustomSelect = ({ value, onChange, options, placeholder, label, required = false }) => {
        const selectedOption = options.find(option => option.id === value);

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
                <Listbox value={value} onChange={onChange}>
                    <div className="relative">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-slate-800 border border-slate-600 py-2 sm:py-2.5 pl-3 pr-10 text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 hover:border-slate-500 transition-colors">
                            <span className="block truncate">
                                {selectedOption ? selectedOption.name : placeholder}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-slate-800 border border-slate-600 py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={option.id}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-8 pr-4 ${active ? 'bg-blue-800 text-white' : 'text-slate-300 hover:bg-slate-700'
                                            }`
                                        }
                                        value={option.id}
                                    >
                                        {({ selected }) => (
                                            <React.Fragment>
                                                <span className={`block truncate ${selected ? 'font-medium text-white' : 'font-normal'}`}>
                                                    {option.name}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-blue-300">
                                                        <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </React.Fragment>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        );
    };

    return (
        <div className="min-h-screen mt-20 bg-black text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
                    {/* Left side - product name */}
                    <div className="flex items-center order-1 sm:order-1">
                        <MapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-800 mr-2 sm:mr-3 flex-shrink-0" />
                        <h1 className="text-xs sm:text-lg md:text-2xl lg:text-3xl font-bold text-white leading-snug text-center sm:text-left">{SITE_BRAND_NAME}</h1>
                    </div>

                    {/* Right side - CollegeAI and description */}
                    <div className="text-center sm:text-right order-2 sm:order-2">
                        <div className="flex items-center justify-center sm:justify-end mb-2">
                            <AcademicCapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-800 mr-2" />
                            <h2 className="text-xl sm:text-2xl font-bold bg-black text-white">
                                CollegeAI
                            </h2>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                            Personalized college recommendations powered by AI
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <SparklesIcon className="h-3 w-3" />
                                <span>AI-Powered</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrophyIcon className="h-3 w-3" />
                                <span>Realistic Matches</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <AcademicCapIcon className="h-3 w-3" />
                                <span>10,000+ Universities</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-black border border-slate-700 rounded-xl shadow-2xl p-4 sm:p-6">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Find Your Perfect College Match</h2>
                        <p className="text-slate-400 text-xs sm:text-sm">Get personalized college recommendations based on your academic profile and preferences</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                        {/* Course & Field Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                            <CustomSelect
                                value={formData.degreeType}
                                onChange={(value) => setFormData(prev => ({ ...prev, degreeType: value }))}
                                options={degreeOptions}
                                placeholder="Select degree type"
                                label="Degree Type"
                                required
                            />

                            <CustomSelect
                                value={formData.field}
                                onChange={(value) => setFormData(prev => ({ ...prev, field: value }))}
                                options={fieldOptions}
                                placeholder="Select field of study"
                                label="Field of Study"
                                required
                            />
                        </div>

                        {/* Custom field input */}
                        {formData.field === 'custom' && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">
                                    Specify Your Field <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="customField"
                                    value={formData.customField || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter your field of study"
                                    className="w-full bg-black border border-black rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-colors"
                                    required
                                />
                            </div>
                        )}

                        {/* Academic Performance Section */}
                        <div className="bg-black rounded-lg p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <TrophyIcon className="h-5 w-5 text-blue-400" />
                                <h3 className="text-white font-semibold">Academic Details</h3>
                                <span className="text-xs bg-blue-800 text-white px-2 py-1 rounded-full">Required</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <CustomSelect
                                    value={formData.currentClass}
                                    onChange={(value) => setFormData(prev => ({ ...prev, currentClass: value }))}
                                    options={currentClassOptions}
                                    placeholder="Select your current level"
                                    label="Current Education Level"
                                    required
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Academic Percentage/CGPA <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="academicPercentage"
                                        value={formData.academicPercentage}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 78.5 (percentage) or 8.5 (CGPA)"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-colors"
                                        required
                                    />
                                    <p className="text-xs text-slate-400">Enter your current academic percentage (0-100) or CGPA out of 10</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <CustomSelect
                                    value={formData.academicBoard}
                                    onChange={(value) => setFormData(prev => ({ ...prev, academicBoard: value }))}
                                    options={boardOptions}
                                    placeholder="Select your board/curriculum"
                                    label="Board/Curriculum"
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Entrance Exam Scores (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="entranceScores"
                                        value={formData.entranceScores}
                                        onChange={handleInputChange}
                                        placeholder="e.g., JEE Main: 110, NEET: 450, CAT: 85%ile, CLAT: 95, SAT: 1200, BITSAT: 280"
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-colors"
                                    />
                                    <p className="text-xs text-slate-400">Add your entrance exam scores for more accurate recommendations</p>
                                </div>
                            </div>
                        </div>

                        {/* Location & Budget Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                            <CustomSelect
                                value={formData.budget}
                                onChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                                options={budgetOptions}
                                placeholder="Select budget preference"
                                label="Budget Preference"
                                required
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">
                                    Preferred Countries
                                </label>
                                <input
                                    type="text"
                                    name="countries"
                                    value={formData.countries}
                                    onChange={handleInputChange}
                                    placeholder="e.g., USA, Canada, UK, Australia, India"
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Duration & State Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                            <CustomSelect
                                value={formData.duration}
                                onChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                                options={durationOptions}
                                placeholder="No preference"
                                label="Course Duration"
                            />

                            {/* Indian State Selection - Only show if India is selected */}
                            {isIndiaSelected && (
                                <CustomSelect
                                    value={formData.indiaState}
                                    onChange={(value) => setFormData(prev => ({ ...prev, indiaState: value }))}
                                    options={[{ id: '', name: 'All States' }, ...indianStates]}
                                    placeholder="All states"
                                    label="Preferred State in India"
                                />
                            )}
                        </div>

                        {/* Scholarship Checkbox */}
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 border border-slate-600">
                            <input
                                type="checkbox"
                                id="needScholarship"
                                name="needScholarship"
                                checked={formData.needScholarship}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-800 bg-slate-700 border-slate-500 rounded focus:ring-blue-800 focus:ring-2 flex-shrink-0"
                            />
                            <label htmlFor="needScholarship" className="text-white font-medium cursor-pointer text-sm sm:text-base">
                                I need scholarship opportunities
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                            {loading ? (
                                <React.Fragment>
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                    <span>Finding Your Perfect Matches...</span>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="hidden sm:inline">Get My College Recommendations</span>
                                    <span className="sm:hidden">Find My Colleges</span>
                                    <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                </React.Fragment>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-4 sm:mt-6">
                    <p className="text-slate-500 text-xs">
                        Trusted by thousands of students • Supports all entrance exams • Personalized recommendations
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;