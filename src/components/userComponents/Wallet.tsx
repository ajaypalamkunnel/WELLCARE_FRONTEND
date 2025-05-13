import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, FileQuestion, Wallet as WalletIcon } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  
  WalletSummaryDTO,
  WalletTransactionDTO,
  TransactionQueryParams
} from '../../types/wallet';
import { getWalletSummary, getWalletTransactions } from '@/services/user/auth/authService';


const Wallet: React.FC = () => {
  // State for wallet summary
  const [walletSummary, setWalletSummary] = useState<WalletSummaryDTO | null>(null);
  
  // State for transactions
  const [transactions, setTransactions] = useState<WalletTransactionDTO[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  
  // Loading states
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(true);

  // Fetch wallet summary
  useEffect(() => {
    const fetchWalletSummary = async () => {
      try {
        setIsLoadingSummary(true);
        const summary = await getWalletSummary();
        setWalletSummary(summary);
      } catch (error) {
        toast.error('Failed to load wallet information');
        console.error('Error fetching wallet summary:', error);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    fetchWalletSummary();
  }, []);

  // Fetch wallet transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingTransactions(true);
        const params: TransactionQueryParams = { page, limit, sort };
        const response = await getWalletTransactions(params);
        
        setTransactions(response.transactions);
        setTotal(response.total);
      } catch (error) {
        toast.error('Failed to load transactions');
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [page, limit, sort]);

  // Handle withdraw button click
  const handleWithdraw = () => {
    toast.info('Withdraw feature coming soon!');
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  // Format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }) + ', ' + date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Wallet Summary Section */}
      <div className="mb-8">
        {isLoadingSummary ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="bg-medical-green rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center mb-4">
                <WalletIcon size={32} className="mr-3" />
                <h2 className="text-2xl font-bold">Your Wallet</h2>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-sm mb-1">Available Balance</p>
                <p className="text-4xl font-bold mb-2">
                  {walletSummary?.currency || '₹'}{walletSummary?.balance.toLocaleString('en-IN') || 0}
                </p>
              </div>
              <button 
                onClick={handleWithdraw}
                className="mt-4 md:mt-0 bg-white text-medical-green px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Transactions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h3 className="text-xl font-semibold mb-4 md:mb-0">Transaction History</h3>
          
          {/* Sort Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
              className="w-full md:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        
        {/* Transactions List */}
        {isLoadingTransactions ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-green"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className={`rounded-full p-2 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDown className="text-green-600" size={20} />
                      ) : (
                        <ArrowUp className="text-red-600" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'credit' ? 'Received' : 'Sent'}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {transaction.reason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <p className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileQuestion size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No transactions yet</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {transactions.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md ${
                  page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page * limit >= total}
                className={`px-4 py-2 rounded-md ${
                  page * limit >= total 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;