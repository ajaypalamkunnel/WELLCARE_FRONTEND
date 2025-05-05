import { getWalletSummary, withdrawAmountApi } from "@/services/doctor/doctorService";
import { DoctorWalletSummaryDTO } from "@/types/wallet";
import { ArrowRight, ChevronLeft, ChevronRight, Filter, Loader2, MoreVertical, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
type TransactionType = 'credit' | 'debit' | undefined;
interface WalletSummary extends DoctorWalletSummaryDTO {
    totalPages: number;
    currentPage: number;
  }
// Main Component
const DoctorWallet: React.FC = () => {
    // States
    const [walletData, setWalletData] = useState<WalletSummary | null>(null);
    
    // Additional wallet overview metrics
    const [showAdditionalMetrics, setShowAdditionalMetrics] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [withdrawMode, setWithdrawMode] = useState<boolean>(false);
    const [withdrawAmount, setWithdrawAmount] = useState<string>('');
    const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<TransactionType>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit] = useState<number>(10);
  
    // Fetch wallet data
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        const data = await getWalletSummary(filter, currentPage, limit);
        
        // Calculate total pages based on totalTransactions and limit
        const totalPages = Math.ceil(data.totalTransactions / limit);
        
        // Set wallet data with additional pagination info
        setWalletData({
          ...data,
          totalPages,
          currentPage
        });
      } catch (error) {
        toast.error('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };
  
    // Initial fetch
    useEffect(() => {
      fetchWalletData();
    }, [filter, currentPage]);
  
    // Handle withdraw submission
    const handleWithdraw = async () => {
      if (!withdrawAmount || isNaN(parseFloat(withdrawAmount))) {
        toast.error('Please enter a valid amount');
        return;
      }
  
      const amount = parseFloat(withdrawAmount);
      
      if (amount <= 0) {
        toast.error('Amount must be greater than zero');
        return;
      }
  
      if (walletData && amount > walletData.withdrawable) {
        toast.error('Amount exceeds withdrawable balance');
        return;
      }
  
      setWithdrawLoading(true);
      try {
        await withdrawAmountApi(amount);
        toast.success('Withdrawal successful');
        setWithdrawMode(false);
        setWithdrawAmount('');
        fetchWalletData(); // Refresh data
      } catch (error) {
        toast.error('Withdrawal failed');
      } finally {
        setWithdrawLoading(false);
      }
    };
  
    // Format date
    const formatDate = (dateValue: Date | string) => {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };
  
    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(amount);
      };
    
  
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* Wallet Overview Card */}
        <div className="bg-[#03045e] text-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Wallet size={24} className="mr-2" />
            <h2 className="text-xl font-bold">Wallet Overview</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-75">Wallet Balance</p>
                  <p className="text-2xl font-bold mt-1">
                    {walletData ? formatCurrency(walletData.balance) : '₹0.00'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm opacity-75">Withdrawable Amount</p>
                  <p className="text-2xl font-bold mt-1">
                    {walletData ? formatCurrency(walletData.withdrawable) : '₹0.00'}
                  </p>
                </div>
                
                {showAdditionalMetrics && walletData && (
                  <>
                    <div>
                      <p className="text-sm opacity-75">Total Credited</p>
                      <p className="text-2xl font-bold mt-1 text-green-400">
                        {formatCurrency(walletData.totalCredited)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm opacity-75">Total Withdrawn</p>
                      <p className="text-2xl font-bold mt-1 text-red-400">
                        {formatCurrency(walletData.totalWithdrawn)}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-3">
                <button 
                  onClick={() => setShowAdditionalMetrics(!showAdditionalMetrics)}
                  className="text-xs text-white/70 hover:text-white underline"
                >
                  {showAdditionalMetrics ? 'Hide details' : 'Show more details'}
                </button>
              </div>
              
              <div className="mt-6">
                {!withdrawMode ? (
                  <button
                    onClick={() => setWithdrawMode(true)}
                    disabled={!walletData || walletData.withdrawable <= 0}
                    className="bg-white text-[#03045e] px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Withdraw Funds
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="px-4 py-2 rounded-md text-gray-800 w-full sm:w-48"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleWithdraw}
                        disabled={withdrawLoading}
                        className="bg-white text-[#03045e] px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center"
                      >
                        {withdrawLoading ? (
                          <Loader2 size={16} className="animate-spin mr-2" />
                        ) : (
                          <ArrowRight size={16} className="mr-2" />
                        )}
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setWithdrawMode(false);
                          setWithdrawAmount('');
                        }}
                        className="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
  
        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
            
            <div className="relative">
              <div className="flex items-center border rounded-md overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-r">
                  <Filter size={16} className="text-gray-500" />
                </div>
                <select
                  value={filter || "all"}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setFilter(e.target.value === "all" ? undefined : e.target.value as TransactionType);
                  }}
                  className="px-4 py-2 outline-none text-sm"
                >
                  <option value="all">All Transactions</option>
                  <option value="credit">Credits Only</option>
                  <option value="debit">Debits Only</option>
                </select>
              </div>
            </div>
          </div>
  
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin text-[#03045e]" />
            </div>
          ) : walletData && walletData.transactions.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {walletData.transactions.map((transaction) => (
                      <tr key={`${transaction.type}-${transaction.amount}-${transaction.createdAt}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'success' ? 'bg-blue-100 text-blue-800' : 
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
  
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {walletData.transactions.map((transaction) => (
                  <div key={`${transaction.type}-${transaction.amount}-${transaction.createdAt}`} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                      </span>
                      <span className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-700">{transaction.reason}</p>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{formatDate(transaction.createdAt)}</span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          transaction.status === 'success' ? 'bg-blue-100 text-blue-800' : 
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Pagination */}
              {walletData.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 px-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center text-sm text-gray-600 hover:text-[#03045e] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: walletData.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          currentPage === page
                            ? 'bg-[#03045e] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, walletData.totalPages))}
                    disabled={currentPage === walletData.totalPages}
                    className="flex items-center text-sm text-gray-600 hover:text-[#03045e] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default DoctorWallet;