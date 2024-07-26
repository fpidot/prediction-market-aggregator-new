import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchSubscriptions, updateSubscription, Subscription } from '../../store/adminSlice';

const SubscriptionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const subscriptions = useAppSelector((state) => state.admin.subscriptions);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const handleToggleActive = (subscription: Subscription) => {
    dispatch(updateSubscription({
      ...subscription,
      isActive: !subscription.isActive
    }));
  };

  return (
    <div className="subscription-list">
      <h2>Subscriptions</h2>
      <table>
        <thead>
          <tr>
            <th>Phone Number</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription: Subscription) => (
            <tr key={subscription._id}>
              <td>{subscription.phoneNumber}</td>
              <td>{subscription.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleToggleActive(subscription)}>
                  {subscription.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionList;