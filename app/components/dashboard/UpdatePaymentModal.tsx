"use client";

import { useState } from "react";
import { 
  X, 
  CreditCard, 
  Lock, 
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Card brand icons
const IconVisa = () => (
  <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
    <rect width="48" height="32" rx="4" fill="#1A1F71"/>
    <path d="M20.5 21H18L19.5 11H22L20.5 21ZM16.5 11L14.1 18L13.8 16.5L12.9 12C12.9 12 12.8 11 11.5 11H7.1L7 11.2C7 11.2 8.5 11.5 10.2 12.6L12.5 21H15.1L19.1 11H16.5ZM35.5 21H38L35.8 11H33.8C32.7 11 32.4 11.9 32.4 11.9L28.5 21H31.1L31.6 19.5H34.8L35.1 21H35.5ZM32.4 17.5L33.8 13.5L34.6 17.5H32.4ZM28.5 14L28.9 11.7C28.9 11.7 27.6 11.2 26.2 11.2C24.7 11.2 21.5 11.9 21.5 14.7C21.5 17.3 25.1 17.3 25.1 18.7C25.1 20.1 21.9 19.8 20.7 18.9L20.3 21.3C20.3 21.3 21.6 21.9 23.5 21.9C25.4 21.9 28.5 20.8 28.5 18.2C28.5 15.5 24.9 15.3 24.9 14.1C24.9 12.9 27.3 13.1 28.5 14Z" fill="white"/>
  </svg>
);

const IconMastercard = () => (
  <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
    <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
    <circle cx="19" cy="16" r="9" fill="#EB001B"/>
    <circle cx="29" cy="16" r="9" fill="#F79E1B"/>
    <path d="M24 9.5C26.1 11 27.5 13.3 27.5 16C27.5 18.7 26.1 21 24 22.5C21.9 21 20.5 18.7 20.5 16C20.5 13.3 21.9 11 24 9.5Z" fill="#FF5F00"/>
  </svg>
);

const IconAmex = () => (
  <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
    <rect width="48" height="32" rx="4" fill="#006FCF"/>
    <path d="M8 15H12L13 13L14 15H19L17.5 12L19 9H14L13 11L12 9H8L9.5 12L8 15ZM24 9V15H28V13.5H26V12.5H28V11H26V10H28V9H24ZM30 9V15H32V13L34 15H37L34 12L37 9H34L32 11V9H30ZM38 9V15H40V13L42 15H45L42 12L45 9H42L40 11V9H38Z" fill="white"/>
    <path d="M8 17V23H12L13 21L14 23H19L17.5 20L19 17H14L13 19L12 17H8ZM11 20H9.5L10.5 18H12L11 20ZM24 17V23H28V21.5H26V20.5H28V19H26V18H28V17H24ZM30 17V23H32V21L34 23H37L34 20L37 17H34L32 19V17H30ZM38 17V23H40V21L42 23H45L42 20L45 17H42L40 19V17H38Z" fill="white"/>
  </svg>
);

interface UpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentCard?: {
    brand: string;
    last4: string;
    expiry: string;
  };
}

export function UpdatePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  currentCard = { brand: "visa", last4: "4242", expiry: "12/25" },
}: UpdatePaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ").substr(0, 19) : "";
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const detectCardBrand = (number: string) => {
    const digits = number.replace(/\D/g, "");
    if (digits.startsWith("4")) return "visa";
    if (digits.startsWith("5") || digits.startsWith("2")) return "mastercard";
    if (digits.startsWith("34") || digits.startsWith("37")) return "amex";
    return null;
  };

  const cardBrand = detectCardBrand(cardNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    // Validation
    const cardDigits = cardNumber.replace(/\D/g, "");
    if (cardDigits.length < 15) {
      setError("Please enter a valid card number");
      setIsProcessing(false);
      return;
    }

    if (expiry.length < 5) {
      setError("Please enter a valid expiry date");
      setIsProcessing(false);
      return;
    }

    if (cvc.length < 3) {
      setError("Please enter a valid CVC");
      setIsProcessing(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setSuccess(true);
    
    // Auto-close after success
    setTimeout(() => {
      onSuccess?.();
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setName("");
    setError(null);
    setSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success State */}
          {success && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Method Updated!</h3>
              <p className="text-sm text-gray-500">
                Your new card has been saved successfully.
              </p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
                    <CreditCard className="h-5 w-5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Update Payment Method</h2>
                    <p className="text-xs text-gray-500">Your card information is secure</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Current Card */}
              <div className="px-6 pt-4">
                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentCard.brand === "visa" && <IconVisa />}
                    {currentCard.brand === "mastercard" && <IconMastercard />}
                    {currentCard.brand === "amex" && <IconAmex />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        •••• {currentCard.last4}
                      </p>
                      <p className="text-xs text-gray-500">Expires {currentCard.expiry}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">Current</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {/* Card Number */}
                <div>
                  <Label className="text-sm text-gray-700">Card Number</Label>
                  <div className="relative mt-1">
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="pl-10 rounded-xl"
                      maxLength={19}
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {cardBrand && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {cardBrand === "visa" && <IconVisa />}
                        {cardBrand === "mastercard" && <IconMastercard />}
                        {cardBrand === "amex" && <IconAmex />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-700">Expiry Date</Label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="mt-1 rounded-xl"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-700">CVC</Label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="mt-1 rounded-xl"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label className="text-sm text-gray-700">Cardholder Name</Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                  <Lock className="h-3.5 w-3.5" />
                  Your payment info is encrypted and secure
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Update Card"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

