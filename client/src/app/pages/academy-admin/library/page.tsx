// 'use client'

// import React, { useState, useEffect } from 'react'
// import { Search, Filter, BookOpen, User, Calendar, Clock, Plus, Edit, Trash2, Download, BarChart3, Books, Bookmark, BookText } from 'lucide-react'
// import DashboardLayout from '@/app/components/DashboardLayout'

// // Types
// interface Book {
//     id: string
//     title: string
//     author: string
//     isbn: string
//     category: string
//     publicationYear: number
//     publisher: string
//     status: 'available' | 'borrowed' | 'reserved' | 'maintenance'
//     borrowedBy?: string
//     borrowedDate?: string
//     dueDate?: string
// }

// interface Borrower {
//     id: string
//     name: string
//     type: 'student' | 'teacher' | 'staff'
//     contact: string
//     borrowedBooks: number
// }

// interface BorrowRecord {
//     id: string
//     bookId: string
//     bookTitle: string
//     borrowerId: string
//     borrowerName: string
//     borrowDate: string
//     dueDate: string
//     returnDate?: string
//     status: 'active' | 'returned' | 'overdue'
// }

// const LibraryManagementPage = () => {
//     // State management
//     const [books, setBooks] = useState<Book[]>([])
//     const [borrowers, setBorrowers] = useState<Borrower[]>([])
//     const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([])
//     const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
//     const [searchTerm, setSearchTerm] = useState('')
//     const [filterCategory, setFilterCategory] = useState('all')
//     const [filterStatus, setFilterStatus] = useState('all')
//     const [view, setView] = useState<'catalog' | 'borrowers' | 'records'>('catalog')
//     const [showAddBook, setShowAddBook] = useState(false)
//     const [showBorrowModal, setShowBorrowModal] = useState(false)
//     const [selectedBook, setSelectedBook] = useState<Book | null>(null)

//     // Sample data - in a real app, this would come from an API
//     useEffect(() => {
//         // Mock book data
//         const mockBooks: Book[] = [
//             {
//                 id: '1',
//                 title: 'Introduction to Computer Science',
//                 author: 'John Smith',
//                 isbn: '978-0123456789',
//                 category: 'Computer Science',
//                 publicationYear: 2020,
//                 publisher: 'Tech Publications',
//                 status: 'available'
//             },
//             {
//                 id: '2',
//                 title: 'Advanced Mathematics',
//                 author: 'Emily Johnson',
//                 isbn: '978-0987654321',
//                 category: 'Mathematics',
//                 publicationYear: 2019,
//                 publisher: 'Math World',
//                 status: 'borrowed',
//                 borrowedBy: 'S101',
//                 borrowedDate: '2023-10-01',
//                 dueDate: '2023-10-15'
//             },
//             {
//                 id: '3',
//                 title: 'Physics for Engineers',
//                 author: 'Michael Brown',
//                 isbn: '978-1122334455',
//                 category: 'Physics',
//                 publicationYear: 2021,
//                 publisher: 'Science Press',
//                 status: 'available'
//             },
//             {
//                 id: '4',
//                 title: 'World History',
//                 author: 'Sarah Davis',
//                 isbn: '978-5544332211',
//                 category: 'History',
//                 publicationYear: 2018,
//                 publisher: 'History Books',
//                 status: 'reserved'
//             },
//             {
//                 id: '5',
//                 title: 'Organic Chemistry',
//                 author: 'Robert Wilson',
//                 isbn: '978-6677889900',
//                 category: 'Chemistry',
//                 publicationYear: 2022,
//                 publisher: 'Chem Publications',
//                 status: 'available'
//             },
//             {
//                 id: '6',
//                 title: 'English Literature',
//                 author: 'Jennifer Lee',
//                 isbn: '978-7788990011',
//                 category: 'Literature',
//                 publicationYear: 2020,
//                 publisher: 'Literary Works',
//                 status: 'borrowed',
//                 borrowedBy: 'T201',
//                 borrowedDate: '2023-10-05',
//                 dueDate: '2023-10-19'
//             },
//             {
//                 id: '7',
//                 title: 'Principles of Economics',
//                 author: 'David Miller',
//                 isbn: '978-8899001122',
//                 category: 'Economics',
//                 publicationYear: 2019,
//                 publisher: 'Economic Review',
//                 status: 'maintenance'
//             },
//             {
//                 id: '8',
//                 title: 'Human Anatomy',
//                 author: 'Lisa Anderson',
//                 isbn: '978-9900112233',
//                 category: 'Biology',
//                 publicationYear: 2021,
//                 publisher: 'Bio Sciences',
//                 status: 'available'
//             }
//         ]

//         // Mock borrower data
//         const mockBorrowers: Borrower[] = [
//             {
//                 id: 'S101',
//                 name: 'John Doe',
//                 type: 'student',
//                 contact: 'john.doe@example.com',
//                 borrowedBooks: 2
//             },
//             {
//                 id: 'S102',
//                 name: 'Jane Smith',
//                 type: 'student',
//                 contact: 'jane.smith@example.com',
//                 borrowedBooks: 1
//             },
//             {
//                 id: 'T201',
//                 name: 'Dr. James Anderson',
//                 type: 'teacher',
//                 contact: 'james.anderson@example.com',
//                 borrowedBooks: 1
//             },
//             {
//                 id: 'T202',
//                 name: 'Ms. Jennifer Lee',
//                 type: 'teacher',
//                 contact: 'jennifer.lee@example.com',
//                 borrowedBooks: 0
//             },
//             {
//                 id: 'ST301',
//                 name: 'Robert Johnson',
//                 type: 'staff',
//                 contact: 'robert.johnson@example.com',
//                 borrowedBooks: 0
//             }
//         ]

//         // Mock borrow records
//         const mockBorrowRecords: BorrowRecord[] = [
//             {
//                 id: 'BR1',
//                 bookId: '2',
//                 bookTitle: 'Advanced Mathematics',
//                 borrowerId: 'S101',
//                 borrowerName: 'John Doe',
//                 borrowDate: '2023-10-01',
//                 dueDate: '2023-10-15',
//                 status: 'active'
//             },
//             {
//                 id: 'BR2',
//                 bookId: '6',
//                 bookTitle: 'English Literature',
//                 borrowerId: 'T201',
//                 borrowerName: 'Dr. James Anderson',
//                 borrowDate: '2023-10-05',
//                 dueDate: '2023-10-19',
//                 status: 'active'
//             },
//             {
//                 id: 'BR3',
//                 bookId: '3',
//                 bookTitle: 'Physics for Engineers',
//                 borrowerId: 'S102',
//                 borrowerName: 'Jane Smith',
//                 borrowDate: '2023-09-15',
//                 dueDate: '2023-09-29',
//                 returnDate: '2023-09-28',
//                 status: 'returned'
//             },
//             {
//                 id: 'BR4',
//                 bookId: '1',
//                 bookTitle: 'Introduction to Computer Science',
//                 borrowerId: 'S101',
//                 borrowerName: 'John Doe',
//                 borrowDate: '2023-09-10',
//                 dueDate: '2023-09-24',
//                 returnDate: '2023-09-30',
//                 status: 'overdue'
//             }
//         ]

//         setBooks(mockBooks)
//         setBorrowers(mockBorrowers)
//         setBorrowRecords(mockBorrowRecords)
//         setFilteredBooks(mockBooks)
//     }, [])

//     // Filter books based on search and filters
//     useEffect(() => {
//         let result = books

//         // Filter by search term
//         if (searchTerm) {
//             const term = searchTerm.toLowerCase()
//             result = result.filter(book =>
//                 book.title.toLowerCase().includes(term) ||
//                 book.author.toLowerCase().includes(term) ||
//                 book.isbn.includes(term) ||
//                 book.category.toLowerCase().includes(term)
//             )
//         }

//         // Filter by category
//         if (filterCategory !== 'all') {
//             result = result.filter(book => book.category === filterCategory)
//         }

//         // Filter by status
//         if (filterStatus !== 'all') {
//             result = result.filter(book => book.status === filterStatus)
//         }

//         setFilteredBooks(result)
//     }, [searchTerm, filterCategory, filterStatus, books])

//     // Calculate library statistics
//     const totalBooks = books.length
//     const availableBooks = books.filter(book => book.status === 'available').length
//     const borrowedBooks = books.filter(book => book.status === 'borrowed').length
//     const overdueBooks = borrowRecords.filter(record => record.status === 'overdue').length

//     // Get unique categories for filter
//     const categories = ['all', ...new Set(books.map(book => book.category))]

//     const handleBorrowBook = (book: Book) => {
//         setSelectedBook(book)
//         setShowBorrowModal(true)
//     }

//     const handleReturnBook = (bookId: string) => {
//         // Update book status
//         const updatedBooks = books.map(book =>
//             book.id === bookId ? { ...book, status: 'available', borrowedBy: undefined, borrowedDate: undefined, dueDate: undefined } : book
//         )

//         // Update borrow record
//         const updatedRecords = borrowRecords.map(record =>
//             record.bookId === bookId && record.status === 'active'
//                 ? { ...record, status: 'returned', returnDate: new Date().toISOString().split('T')[0] }
//                 : record
//         )

//         setBooks(updatedBooks)
//         setBorrowRecords(updatedRecords)
//     }

//     const handleAddBook = (newBook: Omit<Book, 'id'>) => {
//         const book: Book = {
//             ...newBook,
//             id: `B${books.length + 1}`
//         }
//         setBooks([...books, book])
//         setShowAddBook(false)
//     }

//     return (
//         <DashboardLayout>
//             <div className="min-h-screen bg-gray-50 p-6">
//                 <div className="max-w-7xl mx-auto">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Management</h1>
//                     <p className="text-gray-600 mb-8">Manage books, borrowers, and lending records</p>

//                     {/* Summary Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                         <div className="bg-white rounded-lg shadow p-6">
//                             <div className="flex items-center">
//                                 <div className="p-3 rounded-full bg-blue-100 mr-4">
//                                     <Books className="h-6 w-6 text-blue-600" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-800">{totalBooks}</h2>
//                                     <p className="text-gray-600">Total Books</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg shadow p-6">
//                             <div className="flex items-center">
//                                 <div className="p-3 rounded-full bg-green-100 mr-4">
//                                     <BookOpen className="h-6 w-6 text-green-600" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-800">{availableBooks}</h2>
//                                     <p className="text-gray-600">Available Books</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg shadow p-6">
//                             <div className="flex items-center">
//                                 <div className="p-3 rounded-full bg-purple-100 mr-4">
//                                     <Bookmark className="h-6 w-6 text-purple-600" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-800">{borrowedBooks}</h2>
//                                     <p className="text-gray-600">Borrowed Books</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg shadow p-6">
//                             <div className="flex items-center">
//                                 <div className="p-3 rounded-full bg-red-100 mr-4">
//                                     <Clock className="h-6 w-6 text-red-600" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-800">{overdueBooks}</h2>
//                                     <p className="text-gray-600">Overdue Books</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Navigation Tabs */}
//                     <div className="bg-white rounded-lg shadow mb-6">
//                         <div className="flex border-b border-gray-200">
//                             <button
//                                 className={`px-6 py-4 font-medium text-sm ${view === 'catalog' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                                 onClick={() => setView('catalog')}
//                             >
//                                 Book Catalog
//                             </button>
//                             <button
//                                 className={`px-6 py-4 font-medium text-sm ${view === 'borrowers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                                 onClick={() => setView('borrowers')}
//                             >
//                                 Borrowers
//                             </button>
//                             <button
//                                 className={`px-6 py-4 font-medium text-sm ${view === 'records' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                                 onClick={() => setView('records')}
//                             >
//                                 Borrow Records
//                             </button>
//                         </div>
//                     </div>

//                     {/* Action Bar */}
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//                         <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search books..."
//                                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                             </div>

//                             {view === 'catalog' && (
//                                 <div className="flex gap-2">
//                                     <select
//                                         className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         value={filterCategory}
//                                         onChange={(e) => setFilterCategory(e.target.value)}
//                                     >
//                                         <option value="all">All Categories</option>
//                                         {categories.filter(cat => cat !== 'all').map(category => (
//                                             <option key={category} value={category}>{category}</option>
//                                         ))}
//                                     </select>

//                                     <select
//                                         className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         value={filterStatus}
//                                         onChange={(e) => setFilterStatus(e.target.value)}
//                                     >
//                                         <option value="all">All Status</option>
//                                         <option value="available">Available</option>
//                                         <option value="borrowed">Borrowed</option>
//                                         <option value="reserved">Reserved</option>
//                                         <option value="maintenance">Maintenance</option>
//                                     </select>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="flex gap-2 w-full md:w-auto">
//                             {view === 'catalog' && (
//                                 <button
//                                     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto justify-center"
//                                     onClick={() => setShowAddBook(true)}
//                                 >
//                                     <Plus className="h-4 w-4" />
//                                     Add Book
//                                 </button>
//                             )}
//                             <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 border border-gray-300 rounded-lg transition-colors w-full md:w-auto justify-center">
//                                 <Download className="h-4 w-4" />
//                                 Export
//                             </button>
//                         </div>
//                     </div>

//                     {/* Main Content */}
//                     {view === 'catalog' && (
//                         <div className="bg-white rounded-lg shadow">
//                             <div className="px-6 py-4 border-b border-gray-200">
//                                 <h2 className="text-xl font-semibold text-gray-800">Book Catalog</h2>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredBooks.map(book => (
//                                             <tr key={book.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                                                             <BookText className="h-5 w-5 text-blue-600" />
//                                                         </div>
//                                                         <div className="ml-4">
//                                                             <div className="text-sm font-medium text-gray-900">{book.title}</div>
//                                                             <div className="text-sm text-gray-500">{book.publisher}</div>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.isbn}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publicationYear}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                           ${book.status === 'available' ? 'bg-green-100 text-green-800' : ''}
//                           ${book.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' : ''}
//                           ${book.status === 'reserved' ? 'bg-blue-100 text-blue-800' : ''}
//                           ${book.status === 'maintenance' ? 'bg-red-100 text-red-800' : ''}
//                         `}>
//                                                         {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                     <div className="flex space-x-2">
//                                                         {book.status === 'available' ? (
//                                                             <button
//                                                                 className="text-blue-600 hover:text-blue-900"
//                                                                 onClick={() => handleBorrowBook(book)}
//                                                             >
//                                                                 Borrow
//                                                             </button>
//                                                         ) : book.status === 'borrowed' ? (
//                                                             <button
//                                                                 className="text-green-600 hover:text-green-900"
//                                                                 onClick={() => handleReturnBook(book.id)}
//                                                             >
//                                                                 Return
//                                                             </button>
//                                                         ) : null}
//                                                         <button className="text-indigo-600 hover:text-indigo-900">
//                                                             <Edit className="h-4 w-4" />
//                                                         </button>
//                                                         <button className="text-red-600 hover:text-red-900">
//                                                             <Trash2 className="h-4 w-4" />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             {filteredBooks.length === 0 && (
//                                 <div className="text-center py-8">
//                                     <p className="text-gray-500">No books found</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {view === 'borrowers' && (
//                         <div className="bg-white rounded-lg shadow">
//                             <div className="px-6 py-4 border-b border-gray-200">
//                                 <h2 className="text-xl font-semibold text-gray-800">Borrowers</h2>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Books</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {borrowers.map(borrower => (
//                                             <tr key={borrower.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
//                                                             <User className="h-5 w-5 text-purple-600" />
//                                                         </div>
//                                                         <div className="ml-4">
//                                                             <div className="text-sm font-medium text-gray-900">{borrower.name}</div>
//                                                             <div className="text-sm text-gray-500">ID: {borrower.id}</div>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                           ${borrower.type === 'student' ? 'bg-blue-100 text-blue-800' : ''}
//                           ${borrower.type === 'teacher' ? 'bg-green-100 text-green-800' : ''}
//                           ${borrower.type === 'staff' ? 'bg-purple-100 text-purple-800' : ''}
//                         `}>
//                                                         {borrower.type.charAt(0).toUpperCase() + borrower.type.slice(1)}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{borrower.contact}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{borrower.borrowedBooks}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                     <button className="text-blue-600 hover:text-blue-900">View Details</button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     {view === 'records' && (
//                         <div className="bg-white rounded-lg shadow">
//                             <div className="px-6 py-4 border-b border-gray-200">
//                                 <h2 className="text-xl font-semibold text-gray-800">Borrow Records</h2>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {borrowRecords.map(record => (
//                                             <tr key={record.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="text-sm font-medium text-gray-900">{record.bookTitle}</div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="text-sm text-gray-900">{record.borrowerName}</div>
//                                                     <div className="text-sm text-gray-500">ID: {record.borrowerId}</div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.borrowDate}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dueDate}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.returnDate || '-'}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                           ${record.status === 'active' ? 'bg-blue-100 text-blue-800' : ''}
//                           ${record.status === 'returned' ? 'bg-green-100 text-green-800' : ''}
//                           ${record.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
//                         `}>
//                                                         {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Add Book Modal */}
//                 {showAddBook && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                         <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//                             <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Book</h3>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                                     <input
//                                         type="text"
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="Book title"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
//                                     <input
//                                         type="text"
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="Author name"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
//                                     <input
//                                         type="text"
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="ISBN number"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                                     <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                                         <option value="">Select category</option>
//                                         {categories.filter(cat => cat !== 'all').map(category => (
//                                             <option key={category} value={category}>{category}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year</label>
//                                         <input
//                                             type="number"
//                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="Year"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
//                                         <input
//                                             type="text"
//                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="Publisher"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="mt-6 flex justify-end space-x-3">
//                                 <button
//                                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                                     onClick={() => setShowAddBook(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                     onClick={() => {
//                                         // In a real app, we would get the values from the form
//                                         const newBook = {
//                                             title: 'New Book',
//                                             author: 'New Author',
//                                             isbn: '978-0000000000',
//                                             category: 'Computer Science',
//                                             publicationYear: 2023,
//                                             publisher: 'New Publisher',
//                                             status: 'available' as const
//                                         }
//                                         handleAddBook(newBook)
//                                     }}
//                                 >
//                                     Add Book
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Borrow Book Modal */}
//                 {showBorrowModal && selectedBook && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                         <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//                             <h3 className="text-xl font-semibold text-gray-800 mb-4">Borrow Book</h3>
//                             <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//                                 <h4 className="font-medium text-gray-800">{selectedBook.title}</h4>
//                                 <p className="text-sm text-gray-600">by {selectedBook.author}</p>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Select Borrower</label>
//                                     <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                                         <option value="">Select borrower</option>
//                                         {borrowers.map(borrower => (
//                                             <option key={borrower.id} value={borrower.id}>
//                                                 {borrower.name} ({borrower.type})
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
//                                     <input
//                                         type="date"
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="mt-6 flex justify-end space-x-3">
//                                 <button
//                                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                                     onClick={() => setShowBorrowModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                     onClick={() => {
//                                         // Update book status
//                                         const updatedBooks = books.map(book =>
//                                             book.id === selectedBook.id
//                                                 ? { ...book, status: 'borrowed', borrowedBy: 'S101', borrowedDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
//                                                 : book
//                                         )

//                                         // Create new borrow record
//                                         const newRecord: BorrowRecord = {
//                                             id: `BR${borrowRecords.length + 1}`,
//                                             bookId: selectedBook.id,
//                                             bookTitle: selectedBook.title,
//                                             borrowerId: 'S101',
//                                             borrowerName: 'John Doe',
//                                             borrowDate: new Date().toISOString().split('T')[0],
//                                             dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//                                             status: 'active'
//                                         }

//                                         setBooks(updatedBooks)
//                                         setBorrowRecords([...borrowRecords, newRecord])
//                                         setShowBorrowModal(false)
//                                     }}
//                                 >
//                                     Confirm Borrow
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </DashboardLayout>
//     )
// }

// export default LibraryManagementPage