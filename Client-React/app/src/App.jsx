import SearchResults from './pages/SearchResults';
import WorkerPage from './pages/WorkerPage';

<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignUpForm />} />
    <Route path="/profile" element={<UserProfile />} />
    <Route path="/trainer-profile" element={<TrainerProfile />} />
    <Route path="/quiz" element={<Quiz />} />
    <Route path="/content" element={<Content />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/worker" element={<WorkerPage />} />
</Routes> 