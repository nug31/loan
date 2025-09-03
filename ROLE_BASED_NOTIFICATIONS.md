# Role-Based Notification System

## Overview
The loan management system now implements role-based notification filtering, ensuring that users only see notifications relevant to their role (admin or user).

## Implementation Details

### Backend Changes
- **API Endpoint**: `/api/notifications` now accepts optional `role` query parameter
- **Role Filtering**: Notifications are filtered based on user role:
  - **Admin**: Receives all types of notifications (pending requests, due soon loans, overdue loans)
  - **User**: Receives only notifications related to their own loans (due soon, overdue)

### Frontend Changes
- **NotificationContext**: Updated to pass user role to API requests
- **NotificationList Component**: Automatically filters notifications based on current user's role
- **Real-time Updates**: Notification count badge updates correctly for role-specific notifications

## Notification Types by Role

### Admin Notifications
- Pending loan requests requiring approval
- Due soon loans (all users)
- Overdue loans (all users)
- System-wide alerts

### User Notifications
- Personal due soon loans
- Personal overdue loans
- Loan status updates
- Request confirmations

## API Usage

### Get Role-Based Notifications
```
GET /api/notifications?role=admin
GET /api/notifications?role=user
```

### Response Format
```json
{
  "notifications": [
    {
      "id": 1,
      "title": "Loan Due Soon",
      "message": "Your loan for MacBook Pro is due in 2 days",
      "type": "due_soon",
      "isRead": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

## Benefits
- **Reduced Noise**: Users only see relevant notifications
- **Improved UX**: Better focus on actionable items
- **Role Clarity**: Clear separation of admin vs user responsibilities
- **Scalability**: Easy to extend with new roles and notification types

## Future Enhancements
- Email notifications based on role
- Notification preferences per role
- Custom notification rules
- Push notifications for mobile app

## Testing
The system has been tested with:
- Admin users seeing all notifications
- Regular users seeing only personal notifications
- Real-time notification count updates
- Proper filtering across different loan states

## Last Updated
January 2024 - Initial implementation of role-based notification filtering
