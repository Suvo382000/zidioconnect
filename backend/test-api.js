// Quick API Test Script
const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing ZIDIOConnect API...\n');

  // Test 1: Health Check
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    console.log('✅ Health Check:', data.message);
  } catch (err) {
    console.log('❌ Health Check Failed:', err.message);
    console.log('   Make sure backend is running: npm start');
    return;
  }

  // Test 2: Register Student
  console.log('\n📝 Testing Student Registration...');
  const studentEmail = `student${Date.now()}@test.com`;
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: studentEmail,
        password: 'test123',
        role: 'student',
        phone: '1234567890'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Student registered:', studentEmail);
      const studentToken = data.token;

      // Test 3: Update Student Profile
      console.log('\n👤 Testing Student Profile Update...');
      const profileRes = await fetch(`${API_BASE}/profile/student`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          headline: 'Computer Science Student',
          skills: 'JavaScript, Python, React',
          education: 'B.Tech CSE',
          location: 'Mumbai'
        })
      });
      const profileData = await profileRes.json();
      if (profileRes.ok) {
        console.log('✅ Profile updated successfully');
        console.log('   Headline:', profileData.profile.headline);
        console.log('   Skills:', profileData.profile.skills);
      } else {
        console.log('❌ Profile update failed:', profileData.message);
      }
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // Test 4: Register Recruiter
  console.log('\n📝 Testing Recruiter Registration...');
  const recruiterEmail = `recruiter${Date.now()}@test.com`;
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Recruiter',
        email: recruiterEmail,
        password: 'test123',
        role: 'recruiter'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Recruiter registered:', recruiterEmail);
      const recruiterToken = data.token;

      // Test 5: Update Recruiter Profile
      console.log('\n🏢 Testing Recruiter Profile Update...');
      const profileRes = await fetch(`${API_BASE}/profile/recruiter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${recruiterToken}`
        },
        body: JSON.stringify({
          company_name: 'Test Company Ltd',
          company_description: 'A leading tech company',
          industry: 'Technology',
          location: 'Bangalore'
        })
      });
      const profileData = await profileRes.json();
      if (profileRes.ok) {
        console.log('✅ Recruiter profile updated successfully');
        console.log('   Company:', profileData.profile.company_name);
        console.log('   Industry:', profileData.profile.industry);
      } else {
        console.log('❌ Profile update failed:', profileData.message);
      }

      // Test 6: Post a Job
      console.log('\n💼 Testing Job Posting...');
      const jobRes = await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${recruiterToken}`
        },
        body: JSON.stringify({
          title: 'Software Engineer',
          description: 'Looking for a talented software engineer',
          type: 'job',
          location: 'Bangalore',
          work_mode: 'hybrid',
          skills_required: 'JavaScript, Node.js, React',
          experience_level: 'junior'
        })
      });
      const jobData = await jobRes.json();
      if (jobRes.ok) {
        console.log('✅ Job posted successfully');
        console.log('   Job ID:', jobData.job.id);
        console.log('   Title:', jobData.job.title);
      } else {
        console.log('❌ Job posting failed:', jobData.message);
      }
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  console.log('\n✨ API Tests Complete!\n');
}

testAPI();
