import React, { useState } from 'react';
import { Wallet, Building2, DollarSign } from 'lucide-react';

type PaymentMethod = 'telebirr' | 'cbe_birr' | 'cod';

interface PaymentSelectorProps {
  onMethodChange: (method: PaymentMethod) => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({ onMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('telebirr');

  const handleSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onMethodChange(method);
  };

  const methods = [
    {
      id: 'telebirr' as PaymentMethod,
      name: 'telebirr',
      description: 'Pay instantly via telebirr wallet',
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'cbe_birr' as PaymentMethod,
      name: 'CBE Birr',
      description: 'Transfer using Commercial Bank of Ethiopia',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
    },
    {
      id: 'cod' as PaymentMethod,
      name: 'Cash on Delivery',
      description: 'Pay with cash when your order arrives',
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
    },
  ];

  return (
    <div className="my-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Payment Method
      </label>
      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => handleSelect(method.id)}
              className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all text-left ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                  {method.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};