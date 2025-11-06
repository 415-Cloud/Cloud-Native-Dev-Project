# API Setup Guide

## Connecting to Workout Service

The mobile app is now connected to your workout service backend. Here's what you need to know:

## Configuration

The API base URL is configured in `config/api.ts`. By default, it's set to:
- **Development**: `http://10.252.191.93:3001`
- **Production**: Update when deploying

### Update API URL

If your workout service is running on a different IP or port, update `config/api.ts`:

```typescript
return 'http://YOUR_IP:YOUR_PORT';
```

## Prerequisites

1. **Workout Service Running**: Make sure your workout service is running on port 3001 (or the port you configured)
2. **Database**: Ensure PostgreSQL is running and accessible
3. **Network**: Your phone and computer must be on the same Wi-Fi network

## API Endpoints Used

The app uses these endpoints from your workout service:

- `GET /health` - Health check
- `GET /users/:userId/workouts` - Get all workouts for a user
- `GET /workouts/:id` - Get workout by ID
- `POST /workouts` - Create a new workout
- `PUT /workouts/:id` - Update a workout
- `DELETE /workouts/:id` - Delete a workout

## Testing the Connection

1. Start your workout service:
   ```bash
   cd cloud-app/workout-service
   npm start
   ```

2. The service should be running on `http://localhost:3001`

3. Test the health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```

4. In the mobile app, you should see workouts loading from the API

## Troubleshooting

### Connection Issues

- **Error: "Failed to load workouts"**
  - Check if the workout service is running
  - Verify the IP address in `config/api.ts` matches your computer's IP
  - Ensure both devices are on the same network
  - Check firewall settings

### Finding Your IP Address

- **macOS/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: `ipconfig` (look for IPv4 Address)

### Testing with Physical Device

When testing on a physical device:
1. Use your computer's local IP address (not localhost)
2. Make sure the workout service binds to `0.0.0.0` or your specific IP
3. Check that port 3001 is accessible from your network

## User ID

Currently, the app uses a temporary user ID: `user-1`. In production, you'll want to:
- Get the user ID from authentication
- Pass it dynamically based on logged-in user

## Next Steps

- Add authentication to get real user IDs
- Add error handling for network failures
- Add offline support
- Add workout creation screen

