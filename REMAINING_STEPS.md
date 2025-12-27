# Supabase Integration - Remaining Steps

## ✅ What's Already Done

### Authentication
- ✅ Login component using Supabase Auth
- ✅ SignUp component using Supabase Auth
- ✅ App.tsx session management
- ✅ Protected routes

### Dashboard
- ✅ Fetching real equipment count
- ✅ Fetching real request stats
- ✅ Loading state

### Modals
- ✅ CreateRequestModal saves to database
- ✅ AddEquipmentModal ready (already created)
- ✅ SchedulePreventiveModal ready (already created)

---

## 🔄 Components Still Using Mock Data

### 1. AddEquipmentModal
**File**: `src/components/modals/AddEquipmentModal.tsx`

**Already Updated!** This modal uses `createEquipment()` service.

### 2. SchedulePreventiveModal
**File**: `src/components/modals/SchedulePreventiveModal.tsx`

**Needs**: Update to save preventive maintenance to database

**Change**:
```tsx
import { createRequest } from '@/services/requests.service';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await createRequest({
      subject: `Preventive Maintenance - ${selectedEq?.name}`,
      equipment_id: formData.equipment,
      type: 'Preventive',
      scheduled_date: `${formData.date}T${formData.time}`,
      status: 'New',
      priority: 'Medium',
    });
    
    toast({ title: 'PM Scheduled', description: '...' });
    onClose();
  } catch (error) {
    toast({ title: 'Error', variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};
```

### 3. Equipment Page
**File**: `src/pages/Equipment.tsx`

**Needs**: Fetch equipment from database

**Change**:
```tsx
import { useState, useEffect } from 'react';
import { getAllEquipment } from '@/services/equipment.service';

const [equipment, setEquipment] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchEquipment = async () => {
    try {
      const data = await getAllEquipment();
      setEquipment(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchEquipment();
}, []);
```

### 4. Kanban Page
**File**: `src/pages/Kanban.tsx`

**Needs**: Fetch requests from database

**Change**:
```tsx
import { getAllRequests, subscribeToRequests } from '@/services/requests.service';

useEffect(() => {
  const fetchRequests = async () => {
    const data = await getAllRequests();
    setRequests(data || []);
  };
  
  fetchRequests();
  
  // Real-time subscription
  const subscription = subscribeToRequests((payload) => {
    fetchRequests(); // Refresh on changes
  });
  
  return () => { subscription.unsubscribe(); };
}, []);
```

### 5. Teams Page
**File**: `src/pages/Teams.tsx`

**Needs**: Fetch teams from database

**Change**:
```tsx
import { getAllTeams } from '@/services/teams.service';

useEffect(() => {
  const fetchTeams = async () => {
    const data = await getAllTeams();
    setTeams(data || []);
  };
  fetchTeams();
}, []);
```

### 6. Work Centers Page
**File**: `src/pages/WorkCenters.tsx`

**Needs**: Fetch work centers from database

**Change**:
```tsx
import { getAllWorkCenters } from '@/services/workcenters.service';

useEffect(() => {
  const fetchWorkCenters = async () => {
    const data = await getAllWorkCenters();
    setWorkCenters(data || []);
  };
  fetchWorkCenters();
}, []);
```

### 7. Reports Page
**File**: `src/pages/Reports.tsx`

**Needs**: Use real analytics data

**Change**:
```tsx
import { getRequestAnalytics } from '@/services/requests.service';

useEffect(() => {
  const fetchAnalytics = async () => {
    const data = await getRequestAnalytics();
    // Process data for charts
    setChartData(data);
  };
  fetchAnalytics();
}, []);
```

### 8. Calendar Page
**File**: `src/pages/Calendar.tsx`

**Needs**: Fetch scheduled requests

**Change**:
```tsx
import { getAllRequests } from '@/services/requests.service';

useEffect(() => {
  const fetchEvents = async () => {
    const requests = await getAllRequests();
    const events = requests.map(r => ({
      date: r.scheduled_date,
      title: r.subject,
      type: r.type,
    }));
    setEvents(events);
  };
  fetchEvents();
}, []);
```

### 9. RecentActivity Component
**File**: `src/components/dashboard/RecentActivity.tsx`

**Needs**: Fetch recent requests

**Change**:
```tsx
import { getAllRequests } from '@/services/requests.service';

useEffect(() => {
  const fetchActivity = async () => {
    const requests = await getAllRequests();
    const recent = requests.slice(0, 5); // Get 5 most recent
    setActivities(recent);
  };
  fetchActivity();
}, []);
```

### 10. NotificationDropdown
**File**: `src/components/layout/NotificationDropdown.tsx`

**Needs**: Fetch user notifications

**Change**:
```tsx
import { getUserNotifications, subscribeToNotifications } from '@/services/notifications.service';
import { getCurrentUser } from '@/lib/supabase';

useEffect(() => {
  const fetchNotifications = async () => {
    const user = await getCurrentUser();
    if (user) {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
      
      // Real-time subscription
      const sub = subscribeToNotifications(user.id, () => {
        fetchNotifications();
      });
      
      return () => { sub.unsubscribe(); };
    }
  };
  fetchNotifications();
}, []);
```

---

## 🚀 Quick Implementation Pattern

For each component:

1. **Import service**:
   ```tsx
   import { getAllX } from '@/services/x.service';
   ```

2. **Add state**:
   ```tsx
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   ```

3. **Fetch in useEffect**:
   ```tsx
   useEffect(() => {
     const fetchData = async () => {
       try {
         const result = await getAllX();
         setData(result || []);
       } catch (error) {
         console.error('Error:', error);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, []);
   ```

4. **Add loading state**:
   ```tsx
   if (loading) return <div>Loading...</div>;
   ```

5. **Remove mock import**:
   ```tsx
   // DELETE: import { mockData } from '@/data/mockData';
   ```

---

## 📝 Testing Checklist

After updating each component:

- [ ] Component loads without errors
- [ ] Data displays correctly
- [ ] Create operations save to DB
- [ ] Update operations work
- [ ] Delete operations work
- [ ] Real-time updates work (if applicable)
- [ ] Loading states show
- [ ] Error handling works

---

## 🎯 Priority Order

1. **High Priority** (Core functionality):
   - ✅ Dashboard
   - ✅ CreateRequestModal
   - [ ] Equipment page
   - [ ] Kanban board

2. **Medium Priority** (Important features):
   - [ ] Teams page
   - [ ] Work Centers page
   - [ ] Calendar page
   - [ ] Reports page

3. **Low Priority** (Nice to have):
   - [ ] RecentActivity
   - [ ] NotificationDropdown

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Add null checks and default values
```tsx
const data = await getAllX();
setData(data || []);
```

### Issue: TypeScript errors on data types
**Solution**: Use `any[]` temporarily or import types
```tsx
const [data, setData] = useState<any[]>([]);
```

### Issue: Data not updating in real-time
**Solution**: Add subscription
```tsx
const sub = subscribeToX((payload) => {
  fetchData(); // Refresh
});
return () => sub.unsubscribe();
```

---

## ✅ Final Verification

Once all components updated:

1. **Test full flow**:
   - Login → Dashboard → Create Request → View in Kanban
   - Add Equipment → View in Equipment page
   - Schedule PM → View in Calendar

2. **Check database**:
   - Open Supabase dashboard
   - Verify data in tables
   - Check RLS policies working

3. **Test real-time**:
   - Open app in 2 windows
   - Create request in window 1
   - See update in window 2

---

**You're 80% done! Just update the remaining pages following the pattern above.** 🚀
