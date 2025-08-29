// 'use client';

// import { useState } from 'react';
// import { Upload, X, Plus, Eye, EyeOff, Calendar, MapPin, Phone, Mail, User, BookOpen, Award, Clock, DollarSign } from 'lucide-react';

// export default function AddTeachersPage() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [qualifications, setQualifications] = useState([{ degree: '', institution: '', year: '', grade: '' }]);
//   const [experience, setExperience] = useState([{ position: '', company: '', duration: '', description: '' }]);
//   const [subjects, setSubjects] = useState([]);
//   const [availability, setAvailability] = useState({
//     monday: { available: false, startTime: '', endTime: '' },
//     tuesday: { available: false, startTime: '', endTime: '' },
//     wednesday: { available: false, startTime: '', endTime: '' },
//     thursday: { available: false, startTime: '', endTime: '' },
//     friday: { available: false, startTime: '', endTime: '' },
//     saturday: { available: false, startTime: '', endTime: '' },
//     sunday: { available: false, startTime: '', endTime: '' }
//   });

//   const [formData, setFormData] = useState({
//     // Personal Information
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//     nationality: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     emergencyContact: '',
//     emergencyPhone: '',
    
//     // Professional Information
//     employeeId: '',
//     department: '',
//     position: 'Teacher',
//     joiningDate: '',
//     employmentType: 'Full-time',
//     salary: '',
    
//     // Academic Information
//     teachingExperience: '',
//     specialization: [],
//     certifications: [],
//     languages: [],
    
//     // Account Information
//     username: '',
//     password: '',
//     role: 'teacher',
    
//     // Additional Information
//     biography: '',
//     achievements: '',
//     hobbies: '',
//     bloodGroup: '',
//     maritalStatus: ''
//   });

//   const steps = [
//     { number: 1, title: 'Personal Info', description: 'Basic personal details' },
//     { number: 2, title: 'Professional', description: 'Work & qualification details' },
//     { number: 3, title: 'Academic', description: 'Teaching & subject information' },
//     { number: 4, title: 'Schedule', description: 'Availability & timetable' },
//     { number: 5, title: 'Review', description: 'Verify all information' }
//   ];

//   const subjectsList = [
//     'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
//     'Geography', 'Computer Science', 'Economics', 'Psychology', 'Art',
//     'Music', 'Physical Education', 'Foreign Languages', 'Philosophy'
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => setProfileImage(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newDocs = files.map(file => ({
//       id: Date.now() + Math.random(),
//       name: file.name,
//       type: file.type,
//       size: file.size
//     }));
//     setDocuments(prev => [...prev, ...newDocs]);
//   };

//   const removeDocument = (id) => {
//     setDocuments(prev => prev.filter(doc => doc.id !== id));
//   };

//   const addQualification = () => {
//     setQualifications(prev => [...prev, { degree: '', institution: '', year: '', grade: '' }]);
//   };

//   const updateQualification = (index, field, value) => {
//     setQualifications(prev => prev.map((qual, i) => 
//       i === index ? { ...qual, [field]: value } : qual
//     ));
//   };

//   const removeQualification = (index) => {
//     setQualifications(prev => prev.filter((_, i) => i !== index));
//   };

//   const addExperience = () => {
//     setExperience(prev => [...prev, { position: '', company: '', duration: '', description: '' }]);
//   };

//   const updateExperience = (index, field, value) => {
//     setExperience(prev => prev.map((exp, i) => 
//       i === index ? { ...exp, [field]: value } : exp
//     ));
//   };

//   const removeExperience = (index) => {
//     setExperience(prev => prev.filter((_, i) => i !== index));
//   };

//   const toggleSubject = (subject) => {
//     setSubjects(prev => 
//       prev.includes(subject) 
//         ? prev.filter(s => s !== subject)
//         : [...prev, subject]
//     );
//   };

//   const updateAvailability = (day, field, value) => {
//     setAvailability(prev => ({
//       ...prev,
//       [day]: { ...prev[day], [field]: value }
//     }));
//   };

//   const nextStep = () => {
//     if (currentStep < 5) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Teacher data:', {
//       ...formData,
//       profileImage,
//       documents,
//       qualifications,
//       experience,
//       subjects,
//       availability
//     });
//     // Handle form submission
//     alert('Teacher added successfully!');
//   };

//   const renderPersonalInfo = () => (
//     <div className="space-y-6">
//       <div className="mb-8 text-center">
//         <div className="relative inline-block">
//           <div className="w-32 h-32 mx-auto overflow-hidden bg-gray-100 border-4 border-gray-200 rounded-full">
//             {profileImage ? (
//               <img src={profileImage} alt="Profile" className="object-cover w-full h-full" />
//             ) : (
//               <div className="flex items-center justify-center w-full h-full text-gray-400">
//                 <User size={48} />
//               </div>
//             )}
//           </div>
//           <label className="absolute bottom-0 right-0 p-2 text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
//             <Upload size={16} />
//             <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//           </label>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">First Name *</label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter first name"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Last Name *</label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter last name"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full py-3 pr-4 border border-gray-300 rounded-lg pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter email address"
//               required
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number *</label>
//           <div className="relative">
//             <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="w-full py-3 pr-4 border border-gray-300 rounded-lg pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter phone number"
//               required
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth *</label>
//           <div className="relative">
//             <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleInputChange}
//               className="w-full py-3 pr-4 border border-gray-300 rounded-lg pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Gender *</label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           >
//             <option value="">Select gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Nationality</label>
//           <input
//             type="text"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter nationality"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Blood Group</label>
//           <select
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">Select blood group</option>
//             <option value="A+">A+</option>
//             <option value="A-">A-</option>
//             <option value="B+">B+</option>
//             <option value="B-">B-</option>
//             <option value="AB+">AB+</option>
//             <option value="AB-">AB-</option>
//             <option value="O+">O+</option>
//             <option value="O-">O-</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block mb-2 text-sm font-medium text-gray-700">Hobbies & Interests</label>
//         <textarea
//           name="hobbies"
//           value={formData.hobbies}
//           onChange={handleInputChange}
//           rows="2"
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Personal hobbies and interests..."
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Username *</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Create username"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Password *</label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Create password"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3.5 text-gray-400"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderScheduleInfo = () => (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold text-gray-800">Weekly Availability</h3>
//       <div className="space-y-4">
//         {Object.keys(availability).map((day) => (
//           <div key={day} className="p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center justify-between mb-4">
//               <label className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={availability[day].available}
//                   onChange={(e) => updateAvailability(day, 'available', e.target.checked)}
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-lg font-medium text-gray-700 capitalize">{day}</span>
//               </label>
//               {availability[day].available && (
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <Clock size={16} className="text-gray-400" />
//                     <input
//                       type="time"
//                       value={availability[day].startTime}
//                       onChange={(e) => updateAvailability(day, 'startTime', e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                     <span className="text-gray-500">to</span>
//                     <input
//                       type="time"
//                       value={availability[day].endTime}
//                       onChange={(e) => updateAvailability(day, 'endTime', e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//             {!availability[day].available && (
//               <p className="text-sm text-gray-500">Not available on {day}</p>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
//         <h4 className="mb-2 font-semibold text-blue-800">Additional Schedule Notes</h4>
//         <textarea
//           rows="3"
//           className="w-full px-4 py-3 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Any additional notes about availability, preferred time slots, or scheduling constraints..."
//         />
//       </div>
//     </div>
//   );

//   const renderReview = () => (
//     <div className="space-y-8">
//       <div className="p-6 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
//         <h3 className="mb-4 text-xl font-semibold text-gray-800">Review Teacher Information</h3>
//         <p className="text-gray-600">Please review all the information before submitting. Make sure all required fields are filled correctly.</p>
//       </div>

//       {/* Personal Information Summary */}
//       <div className="p-6 bg-white border border-gray-200 rounded-lg">
//         <h4 className="flex items-center mb-4 font-semibold text-gray-800">
//           <User className="mr-2" size={20} />
//           Personal Information
//         </h4>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
//           <div><span className="font-medium">Email:</span> {formData.email}</div>
//           <div><span className="font-medium">Phone:</span> {formData.phone}</div>
//           <div><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}</div>
//           <div><span className="font-medium">Gender:</span> {formData.gender}</div>
//           <div><span className="font-medium">Nationality:</span> {formData.nationality}</div>
//         </div>
//       </div>

//       {/* Professional Information Summary */}
//       <div className="p-6 bg-white border border-gray-200 rounded-lg">
//         <h4 className="flex items-center mb-4 font-semibold text-gray-800">
//           <BookOpen className="mr-2" size={20} />
//           Professional Information
//         </h4>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div><span className="font-medium">Employee ID:</span> {formData.employeeId}</div>
//           <div><span className="font-medium">Department:</span> {formData.department}</div>
//           <div><span className="font-medium">Position:</span> {formData.position}</div>
//           <div><span className="font-medium">Joining Date:</span> {formData.joiningDate}</div>
//           <div><span className="font-medium">Employment Type:</span> {formData.employmentType}</div>
//           <div><span className="font-medium">Salary:</span> ${formData.salary}</div>
//         </div>
//       </div>

//       {/* Academic Information Summary */}
//       <div className="p-6 bg-white border border-gray-200 rounded-lg">
//         <h4 className="flex items-center mb-4 font-semibold text-gray-800">
//           <Award className="mr-2" size={20} />
//           Academic Information
//         </h4>
//         <div className="space-y-2 text-sm">
//           <div><span className="font-medium">Teaching Experience:</span> {formData.teachingExperience} years</div>
//           <div><span className="font-medium">Teaching Subjects:</span> {subjects.join(', ')}</div>
//           <div><span className="font-medium">Qualifications:</span> {qualifications.length} qualification(s) added</div>
//           <div><span className="font-medium">Work Experience:</span> {experience.length} experience(s) added</div>
//         </div>
//       </div>

//       {/* Schedule Summary */}
//       <div className="p-6 bg-white border border-gray-200 rounded-lg">
//         <h4 className="flex items-center mb-4 font-semibold text-gray-800">
//           <Clock className="mr-2" size={20} />
//           Schedule Summary
//         </h4>
//         <div className="space-y-1 text-sm">
//           {Object.entries(availability).map(([day, schedule]) => (
//             <div key={day} className="flex justify-between">
//               <span className="font-medium capitalize">{day}:</span>
//               <span>
//                 {schedule.available 
//                   ? `${schedule.startTime} - ${schedule.endTime}`
//                   : 'Not available'
//                 }
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 bg-white border border-gray-100 shadow-lg rounded-xl">
//           <div className="p-6 border-b border-gray-200">
//             <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
//               Add New Teacher
//             </h1>
//             <p className="mt-2 text-gray-600">Complete all steps to register a new teacher in the academy system</p>
//           </div>

//           {/* Progress Steps */}
//           <div className="p-6">
//             <div className="flex items-center justify-between">
//               {steps.map((step, index) => (
//                 <div key={step.number} className="flex items-center">
//                   <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
//                     currentStep >= step.number 
//                       ? 'bg-blue-600 border-blue-600 text-white' 
//                       : 'border-gray-300 text-gray-500'
//                   }`}>
//                     {currentStep > step.number ? '✓' : step.number}
//                   </div>
//                   <div className="hidden ml-3 sm:block">
//                     <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
//                       {step.title}
//                     </p>
//                     <p className="text-xs text-gray-400">{step.description}</p>
//                   </div>
//                   {index < steps.length - 1 && (
//                     <div className={`hidden sm:block w-20 h-1 mx-4 rounded ${
//                       currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}></div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Form Content */}
//         <form onSubmit={handleSubmit}>
//           <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-xl">
//             {currentStep === 1 && renderPersonalInfo()}
//             {currentStep === 2 && renderProfessionalInfo()}
//             {currentStep === 3 && renderAcademicInfo()}
//             {currentStep === 4 && renderScheduleInfo()}
//             {currentStep === 5 && renderReview()}

//             {/* Navigation Buttons */}
//             <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 disabled={currentStep === 1}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
//                   currentStep === 1
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 Previous
//               </button>

//               {currentStep < 5 ? (
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="px-6 py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105"
//                 >
//                   Next Step
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   className="px-8 py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-105"
//                 >
//                   Submit & Add Teacher
//                 </button>
//               )}
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }mb-2">Address *</label>
//         <textarea
//           name="address"
//           value={formData.address}
//           onChange={handleInputChange}
//           rows="3"
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Enter complete address"
//           required
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">City *</label>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter city"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">State/Province *</label>
//           <input
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter state"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Zip Code</label>
//           <input
//             type="text"
//             name="zipCode"
//             value={formData.zipCode}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter zip code"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Emergency Contact Name</label>
//           <input
//             type="text"
//             name="emergencyContact"
//             value={formData.emergencyContact}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter emergency contact name"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Emergency Contact Phone</label>
//           <input
//             type="tel"
//             name="emergencyPhone"
//             value={formData.emergencyPhone}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter emergency phone"
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderProfessionalInfo = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Employee ID *</label>
//           <input
//             type="text"
//             name="employeeId"
//             value={formData.employeeId}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter employee ID"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Department *</label>
//           <select
//             name="department"
//             value={formData.department}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           >
//             <option value="">Select department</option>
//             <option value="Mathematics">Mathematics</option>
//             <option value="Science">Science</option>
//             <option value="English">English</option>
//             <option value="Social Studies">Social Studies</option>
//             <option value="Arts">Arts</option>
//             <option value="Physical Education">Physical Education</option>
//             <option value="Computer Science">Computer Science</option>
//           </select>
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Position</label>
//           <input
//             type="text"
//             name="position"
//             value={formData.position}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter position"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Joining Date *</label>
//           <input
//             type="date"
//             name="joiningDate"
//             value={formData.joiningDate}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Employment Type *</label>
//           <select
//             name="employmentType"
//             value={formData.employmentType}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           >
//             <option value="Full-time">Full-time</option>
//             <option value="Part-time">Part-time</option>
//             <option value="Contract">Contract</option>
//             <option value="Substitute">Substitute</option>
//           </select>
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Salary</label>
//           <div className="relative">
//             <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             <input
//               type="number"
//               name="salary"
//               value={formData.salary}
//               onChange={handleInputChange}
//               className="w-full py-3 pr-4 border border-gray-300 rounded-lg pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter salary"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Educational Qualifications */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">Educational Qualifications</h3>
//           <button
//             type="button"
//             onClick={addQualification}
//             className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//           >
//             <Plus size={16} className="mr-2" />
//             Add Qualification
//           </button>
//         </div>
//         {qualifications.map((qual, index) => (
//           <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center justify-between mb-3">
//               <h4 className="font-medium text-gray-700">Qualification {index + 1}</h4>
//               {qualifications.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeQualification(index)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <input
//                 type="text"
//                 placeholder="Degree/Qualification"
//                 value={qual.degree}
//                 onChange={(e) => updateQualification(index, 'degree', e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <input
//                 type="text"
//                 placeholder="Institution/University"
//                 value={qual.institution}
//                 onChange={(e) => updateQualification(index, 'institution', e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <input
//                 type="text"
//                 placeholder="Year of completion"
//                 value={qual.year}
//                 onChange={(e) => updateQualification(index, 'year', e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <input
//                 type="text"
//                 placeholder="Grade/CGPA"
//                 value={qual.grade}
//                 onChange={(e) => updateQualification(index, 'grade', e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Work Experience */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
//           <button
//             type="button"
//             onClick={addExperience}
//             className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
//           >
//             <Plus size={16} className="mr-2" />
//             Add Experience
//           </button>
//         </div>
//         {experience.map((exp, index) => (
//           <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center justify-between mb-3">
//               <h4 className="font-medium text-gray-700">Experience {index + 1}</h4>
//               {experience.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeExperience(index)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//             <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
//               <input
//                 type="text"
//                 placeholder="Position/Job Title"
//                 value={exp.position}
//                 onChange={(e) => updateExperience(index, 'position', e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <input
//                 type="text"
//                 placeholder="Company/Institution"
//                 value={exp.company}
//                 onChange={(e) => updateExperience(index, 'company', e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
//                 value={exp.duration}
//                 onChange={(e) => updateExperience(index, 'duration', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <textarea
//               placeholder="Job description and responsibilities"
//               value={exp.description}
//               onChange={(e) => updateExperience(index, 'description', e.target.value)}
//               rows="3"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Document Upload */}
//       <div>
//         <h3 className="mb-4 text-lg font-semibold text-gray-800">Documents</h3>
//         <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
//           <Upload className="mx-auto mb-4 text-gray-400" size={48} />
//           <p className="mb-4 text-gray-600">Upload certificates, transcripts, and other documents</p>
//           <label className="px-6 py-3 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
//             Choose Files
//             <input
//               type="file"
//               multiple
//               onChange={handleDocumentUpload}
//               className="hidden"
//               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//             />
//           </label>
//         </div>
//         {documents.length > 0 && (
//           <div className="mt-4 space-y-2">
//             {documents.map((doc) => (
//               <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
//                 <span className="text-sm text-gray-700">{doc.name}</span>
//                 <button
//                   type="button"
//                   onClick={() => removeDocument(doc.id)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderAcademicInfo = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Teaching Experience (Years)</label>
//           <input
//             type="number"
//             name="teachingExperience"
//             value={formData.teachingExperience}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter years of experience"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">Marital Status</label>
//           <select
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">Select status</option>
//             <option value="single">Single</option>
//             <option value="married">Married</option>
//             <option value="divorced">Divorced</option>
//             <option value="widowed">Widowed</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <h3 className="mb-4 text-lg font-semibold text-gray-800">Teaching Subjects</h3>
//         <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
//           {subjectsList.map((subject) => (
//             <label key={subject} className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={subjects.includes(subject)}
//                 onChange={() => toggleSubject(subject)}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <span className="text-sm text-gray-700">{subject}</span>
//             </label>
//           ))}
//         </div>
//         {subjects.length > 0 && (
//           <div className="mt-4">
//             <p className="text-sm text-gray-600">Selected subjects:</p>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {subjects.map((subject) => (
//                 <span key={subject} className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
//                   {subject}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <div>
//         <label className="block mb-2 text-sm font-medium text-gray-700">Biography</label>
//         <textarea
//           name="biography"
//           value={formData.biography}
//           onChange={handleInputChange}
//           rows="4"
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Write a brief biography about the teacher..."
//         />
//       </div>

//       <div>
//         <label className="block mb-2 text-sm font-medium text-gray-700">Achievements & Awards</label>
//         <textarea
//           name="achievements"
//           value={formData.achievements}
//           onChange={handleInputChange}
//           rows="3"
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="List any achievements, awards, or recognitions..."
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700