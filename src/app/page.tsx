'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Building2, DollarSign, Calendar, Mail, Phone, CheckCircle2, XCircle, RefreshCw, ArrowRight, File, Image as ImageIcon, FileSpreadsheet, X, Download } from 'lucide-react';
import Link from 'next/link';
import loanData from '../../data/main.json';
import attachmentsData from '../../data/attachments.json';

export default function Home() {
  const [currentLoan, setCurrentLoan] = useState<any>(null);
  const [isAttachmentsModalOpen, setIsAttachmentsModalOpen] = useState(false);

  useEffect(() => {
    // Load a random loan on mount
    regenerateLoan();
  }, []);

  const regenerateLoan = () => {
    const randomIndex = Math.floor(Math.random() * loanData.length);
    const loan = loanData[randomIndex];
    // Merge attachments from attachments.json
    const loanWithAttachments = {
      ...loan,
      attachments: attachmentsData[loan.applicationId as keyof typeof attachmentsData] || []
    };
    setCurrentLoan(loanWithAttachments);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Under Review':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Document Collection':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText size={20} className="text-red-400" />;
      case 'Excel':
        return <FileSpreadsheet size={20} className="text-green-400" />;
      case 'Image':
        return <ImageIcon size={20} className="text-blue-400" />;
      default:
        return <File size={20} className="text-gray-400" />;
    }
  };

  const groupAttachmentsByCategory = (attachments: any[]) => {
    const grouped: Record<string, any[]> = {};
    attachments.forEach(attachment => {
      if (!grouped[attachment.category]) {
        grouped[attachment.category] = [];
      }
      grouped[attachment.category].push(attachment);
    });
    return grouped;
  };

  if (!currentLoan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1419] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1419] p-8 text-gray-200 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(76,201,240,0.03)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(157,78,221,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-[slideDown_0.6s_ease-out]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(76,201,240,0.3)]">
              <Building2 size={28} color="#0a0e27" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Loan Processing System
          </h1>
              <p className="text-sm text-gray-400 mt-1 tracking-wide">
                Regional Bank - Small Business Loan Applications
          </p>
        </div>
          </div>
          <button
            onClick={regenerateLoan}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 border-none rounded-lg text-white text-sm font-medium cursor-pointer flex items-center gap-2 transition-all hover:shadow-[0_6px_24px_rgba(76,201,240,0.4)] shadow-[0_4px_16px_rgba(76,201,240,0.3)]"
          >
            <RefreshCw size={18} />
            Regenerate
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Overview Card */}
            <div className="bg-[rgba(18,22,36,0.6)] rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[fadeIn_0.8s_ease-out_0.2s_both]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold text-gray-100">{currentLoan.companyName}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentLoan.status)}`}>
                      {currentLoan.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Application ID: {currentLoan.applicationId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign size={16} />
                    Loan Amount
                  </div>
                  <div className="text-xl font-semibold text-cyan-400">{formatCurrency(currentLoan.loanAmount)}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Calendar size={16} />
                    Submitted Date
                  </div>
                  <div className="text-xl font-semibold text-gray-100">{new Date(currentLoan.submittedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Building2 size={18} className="text-gray-400" />
                  <span className="text-sm"><span className="text-gray-400">Industry:</span> {currentLoan.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FileText size={18} className="text-gray-400" />
                  <span className="text-sm"><span className="text-gray-400">Purpose:</span> {currentLoan.loanPurpose}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm"><span className="text-gray-400">Term:</span> {currentLoan.requestedTerm}</span>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-[rgba(18,22,36,0.6)] rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <Mail size={20} className="text-cyan-400" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                    <FileText size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Primary Contact</div>
                    <div className="font-medium">{currentLoan.contactInfo.primaryContact}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="font-medium">{currentLoan.contactInfo.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                    <Phone size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="font-medium">{currentLoan.contactInfo.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-[rgba(18,22,36,0.6)] rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-cyan-400" />
                Financial Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Annual Revenue</div>
                  <div className="text-lg font-semibold text-cyan-400">{formatCurrency(currentLoan.financialSummary.annualRevenue)}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Total Assets</div>
                  <div className="text-lg font-semibold text-green-400">{formatCurrency(currentLoan.financialSummary.totalAssets)}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Total Liabilities</div>
                  <div className="text-lg font-semibold text-orange-400">{formatCurrency(currentLoan.financialSummary.totalLiabilities)}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Net Worth</div>
                  <div className="text-lg font-semibold text-cyan-400">{formatCurrency(currentLoan.financialSummary.netWorth)}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Debt-to-Equity</div>
                  <div className="text-lg font-semibold text-gray-100">{currentLoan.financialSummary.debtToEquity}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Current Ratio</div>
                  <div className="text-lg font-semibold text-gray-100">{currentLoan.financialSummary.currentRatio}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Documents & Actions */}
          <div className="space-y-6">
            {/* Documents Status Card */}
            <div className="bg-[rgba(18,22,36,0.6)] rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-cyan-400" />
                Document Status
              </h3>
              
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Uploaded Documents ({currentLoan.documents.uploaded.length})</div>
                <div className="space-y-2">
                  {currentLoan.documents.uploaded.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded-lg p-2 border border-white/10">
                      <CheckCircle2 size={16} className="text-green-400" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>

              {currentLoan.documents.missing.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Missing Documents ({currentLoan.documents.missing.length})</div>
                  <div className="space-y-2">
                    {currentLoan.documents.missing.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded-lg p-2 border border-orange-500/20">
                        <XCircle size={16} className="text-orange-400" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentLoan.attachments && currentLoan.attachments.length > 0 && (
                <button
                  onClick={() => setIsAttachmentsModalOpen(true)}
                  className="w-full mt-4 px-4 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-400 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <FileText size={16} />
                  View All Attachments ({currentLoan.attachments.length})
                </button>
              )}
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-2xl p-6 backdrop-blur-xl border border-cyan-400/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Next Steps</h3>
              <p className="text-sm text-gray-400 mb-6">
                Review the application details and proceed to financial spreading to analyze the balance sheet and income statement.
              </p>
              <Link
                href="/form"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 border-none rounded-lg text-white text-sm font-medium cursor-pointer flex items-center justify-center gap-2 transition-all hover:shadow-[0_6px_24px_rgba(76,201,240,0.4)] shadow-[0_4px_16px_rgba(76,201,240,0.3)]"
              >
                Proceed to Financial Spreading
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Modal */}
      {isAttachmentsModalOpen && currentLoan.attachments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsAttachmentsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[rgba(18,22,36,0.95)] rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col animate-[fadeIn_0.3s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-semibold text-gray-100">Attachments</h2>
                <p className="text-sm text-gray-400 mt-1">{currentLoan.companyName} - {currentLoan.attachments.length} files</p>
              </div>
              <button
                onClick={() => setIsAttachmentsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const grouped = groupAttachmentsByCategory(currentLoan.attachments);
                return Object.entries(grouped).map(([category, files]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-cyan-400 rounded-full" />
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {files.map((file: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-100 truncate">{file.name}</div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                              <span>{file.type}</span>
                              <span>•</span>
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{new Date(file.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                          <button className="flex-shrink-0 p-2 hover:bg-cyan-400/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <Download size={18} className="text-cyan-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Total: {currentLoan.attachments.length} files
              </div>
              <button
                onClick={() => setIsAttachmentsModalOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg text-white text-sm font-medium hover:shadow-[0_4px_16px_rgba(76,201,240,0.3)] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
