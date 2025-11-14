// Test script to verify the add-user API endpoint
// Run this from the browser console or use a tool like Postman

async function testAddUser() {
  const testUser = {
    credential: 'test456',
    firstName: 'Maria',
    lastName: 'Santos',
    role: 'staff'
  };

  try {
    const response = await fetch('/api/admin/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', data);
    } else {
      console.error('❌ Error:', data);
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
}

// Uncomment to run the test
// testAddUser();

/* Expected Success Response:
{
  "success": true,
  "message": "User Maria Santos created successfully",
  "user": {
    "credential": "test456",
    "firstName": "Maria",
    "lastName": "Santos",
    "role": "staff"
  }
}
*/

/* Expected Error Response (if user exists):
{
  "error": "User with this credential already exists"
}
*/
