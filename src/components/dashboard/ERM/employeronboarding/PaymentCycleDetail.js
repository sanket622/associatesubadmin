import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSingleContractCombination } from '../redux/employeronboarding/paymentCycleSlice';

const PaymentCycleDetail = () => {
  const { contractId } = useParams();
  const dispatch = useDispatch();
  const { data: cycleData, loading } = useSelector(state => state.paymentCycle);

  useEffect(() => {
    if (contractId) {
      dispatch(fetchSingleContractCombination(contractId));
    }
  }, [contractId, dispatch]);

  if (loading || !cycleData) return <div className="p-6">Loading...</div>;

  const {
    accuralStartAt,
    accuralEndAt,
    payoutDate,
    triggerNextMonth,
    ContractCombinationRuleBook = [],
  } = cycleData;

  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 border border-gray-200 shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-black">Payment Cycle Detail View</h1>

      {/* Cycle Card */}
      <div className="border border-gray-200 shadow-md rounded-lg p-6 bg-white">
        <h2 className="text-lg font-medium text-black mb-6">Cycle</h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-base font-medium text-black mb-2">Accrual Date</h3>
            <p className="text-gray-600 text-sm">
              {formatDate(accuralStartAt)} to {formatDate(accuralEndAt)}
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-black mb-2">Payout Date</h3>
            <p className="text-gray-600 text-sm">{formatDate(payoutDate)}</p>
          </div>
          <div>
            <h3 className="text-base font-medium text-black mb-2">Payment Trigger</h3>
            <p className="text-gray-600 text-sm">{triggerNextMonth ? 'Next Month' : 'This Month'}</p>
          </div>
        </div>
      </div>

      {/* Rules Card */}
      <div className="border border-gray-200 shadow-md rounded-lg p-6 bg-white">
        <h2 className="text-lg font-medium text-black mb-6">Rules</h2>
        <div className="space-y-8">
          {ContractCombinationRuleBook.map((rule, index) => (
            <div key={rule.id} className="mb-4">
              <h3 className="text-base font-semibold text-black mb-4">Rule {index + 1}</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-black mb-1">Work Location</h4>
                  <p className="text-gray-600 text-sm">{rule.workLocation?.workspaceName || '—'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-black mb-1">Working Time Period</h4>
                  <p className="text-gray-600 text-sm">{rule.workingPeriod}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentCycleDetail;
