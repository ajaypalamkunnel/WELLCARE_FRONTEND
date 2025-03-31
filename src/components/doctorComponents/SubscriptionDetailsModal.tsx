"use client"
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { SubscriptionPlan } from "@/types/subscriptionTypes";

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionData: SubscriptionPlan | null;
}

const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  isOpen,
  onClose,
  subscriptionData,
}) => {
   
    
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
              <Dialog.Title className="text-lg font-bold text-gray-800">
                Current Subscription Details
              </Dialog.Title>

              {subscriptionData ? (
                <div className="mt-4 space-y-3">
                  <p>
                    <span className="font-semibold">Plan Name:</span>{" "}
                    {subscriptionData.planId.planName}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> ₹
                    {subscriptionData.planId.price}
                  </p>
                  <p>
                    <span className="font-semibold">Final Price:</span> ₹
                    {subscriptionData.planId.finalPrice}{" "}
                    {subscriptionData.planId.discount &&
                      `(-${subscriptionData.planId.discount.amount}₹ discount)`}
                  </p>
                  <p>
                    <span className="font-semibold">Start Date:</span>{" "}
                    {new Date(subscriptionData.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">End Date:</span>{" "}
                    {new Date(subscriptionData.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Payment Status:</span>{" "}
                    {subscriptionData.paymentStatus}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        subscriptionData.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {subscriptionData.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Features:</span>{" "}
                    {subscriptionData.planId.features.join(", ")}
                  </p>
                </div>
              ) : (
                <p className="text-red-500">No subscription details available</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SubscriptionDetailsModal;
