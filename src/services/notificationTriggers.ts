import { notificationService, NotificationPayload } from './notificationService';
import { Loan, Item, User } from '../types';

export class NotificationTriggers {
  
  // Loan-related notifications
  static async onLoanRequested(loan: Loan, item: Item, user: User) {
    // Notify admins about new loan request
    const payload: NotificationPayload = {
      type: 'loan_request',
      title: 'New Loan Request',
      message: `${user.firstName || user.name || 'User'} has requested to borrow "${item.name}"`,
      adminOnly: true,
      relatedId: loan.id,
    };

    try {
      await notificationService.sendNotification(payload);
      console.log('✅ Loan request notification sent to admins');
    } catch (error) {
      console.error('❌ Failed to send loan request notification:', error);
    }
  }

  static async onLoanApproved(loan: Loan, item: Item, user: User, approvedBy?: string) {
    // Notify user that their loan was approved
    const userPayload: NotificationPayload = {
      type: 'loan_approved',
      title: 'Loan Approved! 🎉',
      message: `Your request to borrow "${item.name}" has been approved. You can now collect the item.`,
      userId: user.id,
      relatedId: loan.id,
    };

    // Notify admins about the approval
    const adminPayload: NotificationPayload = {
      type: 'loan_approved',
      title: 'Loan Approved',
      message: `${item.name} loan for ${user.firstName || user.name || 'User'} has been approved${approvedBy ? ` by ${approvedBy}` : ''}.`,
      adminOnly: true,
      relatedId: loan.id,
    };

    try {
      await Promise.all([
        notificationService.sendNotification(userPayload),
        notificationService.sendNotification(adminPayload)
      ]);
      console.log('✅ Loan approval notifications sent');
    } catch (error) {
      console.error('❌ Failed to send loan approval notifications:', error);
    }
  }

  static async onLoanRejected(loan: Loan, item: Item, user: User) {
    // Notify user that their loan was rejected
    const userPayload: NotificationPayload = {
      type: 'loan_rejected',
      title: 'Loan Request Not Approved',
      message: `Unfortunately, your request to borrow "${item.name}" was not approved. Please contact an administrator for more details.`,
      userId: user.id,
      relatedId: loan.id,
    };

    try {
      await notificationService.sendNotification(userPayload);
      console.log('✅ Loan rejection notification sent to user');
    } catch (error) {
      console.error('❌ Failed to send loan rejection notification:', error);
    }
  }

  static async onItemReturned(loan: Loan, item: Item, user: User) {
    // Notify admins that an item was returned
    const adminPayload: NotificationPayload = {
      type: 'loan_returned',
      title: 'Item Returned',
      message: `"${item.name}" has been returned by ${user.firstName || user.name || 'User'}.`,
      adminOnly: true,
      relatedId: loan.id,
    };

    // Notify user that return was processed
    const userPayload: NotificationPayload = {
      type: 'loan_returned',
      title: 'Return Confirmed ✅',
      message: `Your return of "${item.name}" has been confirmed. Thank you for using SmartLend!`,
      userId: user.id,
      relatedId: loan.id,
    };

    try {
      await Promise.all([
        notificationService.sendNotification(adminPayload),
        notificationService.sendNotification(userPayload)
      ]);
      console.log('✅ Item return notifications sent');
    } catch (error) {
      console.error('❌ Failed to send item return notifications:', error);
    }
  }

  static async onLoanOverdue(loan: Loan, item: Item, user: User) {
    // Notify user about overdue item
    const userPayload: NotificationPayload = {
      type: 'loan_overdue',
      title: '⚠️ Item Overdue',
      message: `Your borrowed item "${item.name}" is overdue. Please return it as soon as possible to avoid penalties.`,
      userId: user.id,
      relatedId: loan.id,
    };

    // Notify admins about overdue item
    const adminPayload: NotificationPayload = {
      type: 'loan_overdue',
      title: 'Overdue Item Alert',
      message: `"${item.name}" borrowed by ${user.firstName || user.name || 'User'} is now overdue.`,
      adminOnly: true,
      relatedId: loan.id,
    };

    try {
      await Promise.all([
        notificationService.sendNotification(userPayload),
        notificationService.sendNotification(adminPayload)
      ]);
      console.log('✅ Overdue notifications sent');
    } catch (error) {
      console.error('❌ Failed to send overdue notifications:', error);
    }
  }

  // Item-related notifications
  static async onItemAdded(item: Item, addedBy?: string) {
    // Notify users about new item availability
    const payload: NotificationPayload = {
      type: 'item_added',
      title: 'New Item Available! 📦',
      message: `"${item.name}" is now available for borrowing in the ${item.category} category.`,
      relatedId: item.id,
    };

    try {
      await notificationService.sendNotification(payload);
      console.log('✅ New item notification sent');
    } catch (error) {
      console.error('❌ Failed to send new item notification:', error);
    }
  }

  static async onItemUpdated(item: Item, updatedBy?: string) {
    // Only notify if the item becomes available again
    if (item.quantity > 0 && item.availableQuantity > 0) {
      const payload: NotificationPayload = {
        type: 'item_updated',
        title: 'Item Available Again! 🔄',
        message: `"${item.name}" is available again for borrowing.`,
        relatedId: item.id,
      };

      try {
        await notificationService.sendNotification(payload);
        console.log('✅ Item availability notification sent');
      } catch (error) {
        console.error('❌ Failed to send item availability notification:', error);
      }
    }
  }

  // System notifications
  static async onWelcomeUser(user: User) {
    const payload: NotificationPayload = {
      type: 'welcome',
      title: 'Welcome to SmartLend! 👋',
      message: `Hi ${user.firstName || user.name || 'there'}! Welcome to SmartLend. Start by browsing our available items.`,
      userId: user.id,
    };

    try {
      await notificationService.sendNotification(payload);
      console.log('✅ Welcome notification sent to user');
    } catch (error) {
      console.error('❌ Failed to send welcome notification:', error);
    }
  }

  static async onSystemMaintenance(message: string, maintenanceDate?: Date) {
    const payload: NotificationPayload = {
      type: 'system_maintenance',
      title: '🔧 System Maintenance Notice',
      message: `${message}${maintenanceDate ? ` Scheduled for: ${maintenanceDate.toLocaleDateString()}` : ''}`,
    };

    try {
      await notificationService.sendNotification(payload);
      console.log('✅ System maintenance notification sent to all users');
    } catch (error) {
      console.error('❌ Failed to send system maintenance notification:', error);
    }
  }

  // Due date reminders
  static async onLoanDueSoon(loan: Loan, item: Item, user: User, daysBefore: number) {
    const payload: NotificationPayload = {
      type: 'loan_request', // Using generic type for due date reminders
      title: `📅 Return Reminder`,
      message: `Your borrowed item "${item.name}" is due in ${daysBefore} day${daysBefore !== 1 ? 's' : ''}. Please prepare to return it on time.`,
      userId: user.id,
      relatedId: loan.id,
    };

    try {
      await notificationService.sendNotification(payload);
      console.log(`✅ Due date reminder sent to user (${daysBefore} days before)`);
    } catch (error) {
      console.error('❌ Failed to send due date reminder:', error);
    }
  }
}
