import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Include MixinStorage
  include MixinStorage();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Profile = {
    name : Text;
    dateOfBirth : Text;
    school : Text;
    classYear : Text;
    language : Text; // "en" or "hi"
    appearance : { #light; #dark };
  };

  public type CareerQuizResult = {
    recommendedStream : Text;
    suggestedSubjects : [Text];
    careerScope : Text;
    score : Nat;
  };

  public type CareerQuizQuestion = {
    question : Text;
    options : [Text];
    categoryScores : [Nat];
  };

  public type Scholarship = {
    title : Text;
    description : Text;
    eligibility : Text;
    link : Text;
  };

  public type Internship = {
    title : Text;
    description : Text;
    company : Text;
    duration : Text;
    eligibility : Text;
    link : Text;
  };

  public type MockTestQuestion = {
    question : Text;
    options : [Text];
    correctAnswer : Nat;
  };

  public type MockTestResult = {
    subject : Text;
    score : Nat;
    correctAnswers : [Nat];
    performanceRating : Text;
  };

  public type ChatMessage = {
    sender : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type ChatSession = {
    messages : List.List<ChatMessage>;
    created : Time.Time;
  };

  module Profile {
    public func compare(p1 : Profile, p2 : Profile) : Order.Order {
      switch (Text.compare(p1.name, p2.name)) {
        case (#equal) { Text.compare(p1.school, p2.school) };
        case (order) { order };
      };
    };
  };

  module Scholarship {
    public func compare(s1 : Scholarship, s2 : Scholarship) : Order.Order {
      Text.compare(s1.title, s2.title);
    };
  };

  module Internship {
    public func compare(i1 : Internship, i2 : Internship) : Order.Order {
      Text.compare(i1.title, i2.title);
    };
  };

  module CareerQuizResult {
    public func compare(r1 : CareerQuizResult, r2 : CareerQuizResult) : Order.Order {
      Nat.compare(r1.score, r2.score);
    };

    public func compareByStream(r1 : CareerQuizResult, r2 : CareerQuizResult) : Order.Order {
      Text.compare(r1.recommendedStream, r2.recommendedStream);
    };
  };

  // Persistent storage
  let profiles = Map.empty<Principal, Profile>();
  let careerQuizResults = Map.empty<Principal, CareerQuizResult>();
  let savedScholarships = Map.empty<Principal, List.List<Text>>();
  let savedInternships = Map.empty<Principal, List.List<Text>>();
  let chatSessions = Map.empty<Principal, ChatSession>();

  // Static career quiz questions
  let careerQuizQuestions = List.fromArray<CareerQuizQuestion>([
    {
      question = "Which subject do you enjoy the most?";
      options = [ "Mathematics", "Biology", "Economics", "History" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "What activity do you prefer?";
      options = [ "Solving puzzles", "Helping others", "Analyzing data", "Writing stories" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "Which career appeals to you?";
      options = [ "Engineer", "Doctor", "Accountant", "Artist" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "What is your favorite science subject?";
      options = [ "Physics", "Chemistry", "Biology", "History" ];
      categoryScores = [ 3, 3, 1, 0 ];
    },
    {
      question = "Which skill do you excel at?";
      options = [ "Problem-solving", "Communication", "Mathematics", "Creativity" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "What kind of environment do you prefer?";
      options = [ "Laboratory", "Hospital", "Office", "Studio" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "Which subject do you find challenging?";
      options = [ "Math", "Biology", "Economics", "History" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "What is your preferred learning style?";
      options = [ "Hands-on", "Visual", "Verbal", "Creative" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "Which field do you want to pursue?";
      options = [ "Engineering", "Medical", "Commerce", "Arts" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
    {
      question = "What is your dream job?";
      options = [ "Scientist", "Doctor", "Entrepreneur", "Artist" ];
      categoryScores = [ 3, 1, 2, 0 ];
    },
  ]);

  // Static scholarship data
  let scholarships = List.fromArray<Scholarship>([
    {
      title = "National Talent Scholarship";
      description = "For high-performing students in academics.";
      eligibility = "10th grade and above";
      link = "https://ntscholarship.org";
    },
    {
      title = "STEM Girls Scholarship";
      description = "Support for girls pursuing STEM careers.";
      eligibility = "Female students, high school";
      link = "https://stemgirls.org";
    },
  ]);

  // Static internship data
  let internships = List.fromArray<Internship>([
    {
      title = "Tech Innovators Internship";
      description = "Summer internship in technology companies.";
      company = "Tech Innovators";
      duration = "3 months";
      eligibility = "Final year students";
      link = "https://techinnovators.com/internships";
    },
    {
      title = "Marketing Strategist Internship";
      description = "Hands-on marketing experience.";
      company = "Market Solutions";
      duration = "2 months";
      eligibility = "Undergraduate students";
      link = "https://marketsolutions.com/internships";
    },
  ]);

  // ---- Required profile interface functions ----

  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // ---- Profile Functions ----

  public shared ({ caller }) func saveProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile() : async Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func logout() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can logout");
    };
    profiles.remove(caller);
    careerQuizResults.remove(caller);
    savedScholarships.remove(caller);
    savedInternships.remove(caller);
    chatSessions.remove(caller);
  };

  // ---- Career Quiz Functions ----

  public query ({ caller }) func getCareerQuizQuestions() : async [CareerQuizQuestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view career quiz questions");
    };
    careerQuizQuestions.toArray();
  };

  public shared ({ caller }) func submitCareerQuiz(answers : [Nat]) : async CareerQuizResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit career quiz results");
    };

    var scienceScore = 0;
    var medicalScore = 0;
    var commerceScore = 0;
    var artsScore = 0;

    for (i in answers.keys()) {
      let questionArray = careerQuizQuestions.toArray();
      if (i < questionArray.size()) {
        let question = questionArray[i];
        let selectedOption = answers[i];
        let score = if (selectedOption < question.categoryScores.size()) {
          question.categoryScores[selectedOption];
        } else { 0 };

        if (Text.equal(question.options[selectedOption], "Mathematics")) {
          scienceScore += score;
        } else if (Text.equal(question.options[selectedOption], "Biology")) {
          medicalScore += score;
        } else if (Text.equal(question.options[selectedOption], "Economics")) {
          commerceScore += score;
        } else {
          artsScore += score;
        };
      };
    };

    func max(a : Nat, b : Nat) : Nat {
      if (a > b) { a } else { b };
    };

    func max4(a : Nat, b : Nat, c : Nat, d : Nat) : Nat {
      max(max(a, b), max(c, d));
    };

    let maxScore = max4(scienceScore, medicalScore, commerceScore, artsScore);

    let recommendedStream = if (maxScore == scienceScore) {
      "Science/Engineering";
    } else if (maxScore == medicalScore) {
      "Medical";
    } else if (maxScore == commerceScore) {
      "Commerce";
    } else {
      "Arts";
    };

    let result : CareerQuizResult = {
      recommendedStream;
      suggestedSubjects = [];
      careerScope = "Career scope for " # recommendedStream;
      score = maxScore;
    };

    careerQuizResults.add(caller, result);
    result;
  };

  public query ({ caller }) func getCareerQuizResult() : async ?CareerQuizResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view career quiz results");
    };
    careerQuizResults.get(caller);
  };

  // ---- Scholarship & Internship Functions ----

  public query ({ caller }) func getAllScholarships() : async [Scholarship] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view scholarships");
    };
    scholarships.toArray().sort();
  };

  public query ({ caller }) func getAllInternships() : async [Internship] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view internships");
    };
    internships.toArray().sort();
  };

  public query ({ caller }) func getSavedScholarships() : async ?[Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view saved scholarships");
    };
    switch (savedScholarships.get(caller)) {
      case (null) { null };
      case (?scholarshipList) { ?scholarshipList.toArray() };
    };
  };

  public query ({ caller }) func getSavedInternships() : async ?[Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view saved internships");
    };
    switch (savedInternships.get(caller)) {
      case (null) { null };
      case (?internshipList) { ?internshipList.toArray() };
    };
  };

  public shared ({ caller }) func saveScholarship(scholarshipTitle : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save scholarships");
    };
    let currentList = switch (savedScholarships.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?list) { list };
    };
    currentList.add(scholarshipTitle);
    savedScholarships.add(caller, currentList);
  };

  public shared ({ caller }) func saveInternship(internshipTitle : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save internships");
    };
    let currentList = switch (savedInternships.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?list) { list };
    };
    currentList.add(internshipTitle);
    savedInternships.add(caller, currentList);
  };

  // ---- Mock Test Functions ----

  public query ({ caller }) func getMockTest(subject : Text) : async [MockTestQuestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can attempt mock tests");
    };

    let questions : [MockTestQuestion] = [
      {
        question = "What is 2 + 2?";
        options = [ "1", "2", "3", "4" ];
        correctAnswer = 3;
      },
    ];

    questions;
  };

  public shared ({ caller }) func submitMockTest(subject : Text, answers : [Nat]) : async MockTestResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit mock tests");
    };

    let questions : [MockTestQuestion] = [
      {
        question = "What is 2 + 2?";
        options = [ "1", "2", "3", "4" ];
        correctAnswer = 3;
      },
    ];

    var score = 0;
    let correctAnswers = Array.tabulate(questions.size(), func(i) { questions[i].correctAnswer });

    for (i in answers.keys()) {
      if (i < questions.size() and answers[i] == questions[i].correctAnswer) {
        score += 1;
      };
    };

    let performanceRating = switch (score) {
      case (0) { "Needs Improvement" };
      case (1) { "Good" };
      case (_) { "Excellent" };
    };

    {
      subject;
      score;
      correctAnswers = answers;
      performanceRating;
    };
  };

  // ---- Rule-Based Chatbot & Chat History Functions ----

  func getChatbotResponse(message : Text) : Text {
    let careersKeywords = [ "career", "opportunities", "field", "profession", "job", "work" ];
    let engineeringKeywords = [ "engineering", "engineer", "science", "physics", "mathematics" ];
    let medicalKeywords = [ "medical", "doctor", "biology", "medicine", "health" ];
    let artsKeywords = [ "arts", "artist", "creative", "design", "writing" ];
    let commerceKeywords = [ "commerce", "business", "accounting", "finance", "economics" ];
    let jeeKeywords = [ "jee", "engineering entrance", "joint entrance exam" ];
    let neetKeywords = [ "neet", "medical entrance", "national eligibility" ];
    let scholarshipsKeywords = [ "scholarship", "financial aid", "grant", "funding" ];
    let internshipsKeywords = [ "internship", "hands-on experience", "work experience" ];
    let studyTipsKeywords = [ "study", "study tips", "exam preparation", "learning" ];
    let examPrepKeywords = [ "exam", "preparation", "test", "assessment" ];
    let streamSelectionKeywords = [ "stream selection", "choose stream", "branch" ];
    let subjectsKeywords = [ "subject", "subjects", "courses", "study area" ];
    let collegeAdmissionKeywords = [ "college admission", "university", "apply to college" ];
    let mathematicsKeywords = [ "math", "mathematics", "algebra", "calculus" ];
    let biologyKeywords = [ "biology", "life science", "biochemistry" ];
    let physicsKeywords = [ "physics", "mechanics", "quantum" ];
    let chemistryKeywords = [ "chemistry", "organic", "inorganic" ];
    let computerScienceKeywords = [ "computer science", "programming", "coding" ];
    let historyKeywords = [ "history", "historical studies", "archaeology" ];
    let economicsKeywords = [ "economics", "economy", "finance", "business" ];

    func containsKeyword(message : Text, keywords : [Text]) : Bool {
      let lowerMessage = message.toLower();
      for (keyword in keywords.values()) {
        let lowerKeyword = keyword.toLower();
        if (lowerMessage.contains(#text(lowerKeyword))) {
          return true;
        };
      };
      false;
    };

    // Return appropriate response based on keywords
    if (containsKeyword(message, careersKeywords)) {
      "Explore career options based on your interests and strengths. Take our career quiz for personalized guidance.";
    } else if (containsKeyword(message, engineeringKeywords)) {
      "Engineering is a versatile field. Consider exploring streams like Mechanical, Electrical, Civil, or Computer Science.";
    } else if (containsKeyword(message, medicalKeywords)) {
      "The medical field focuses on health and medicine. Key subjects include Biology, Chemistry, and Physics.";
    } else if (containsKeyword(message, artsKeywords)) {
      "Arts stream offers creativity and expression through visual arts, music, literature, etc.";
    } else if (containsKeyword(message, commerceKeywords)) {
      "Commerce is focused on business, finance, and economics. Gain skills in accounting and management.";
    } else if (containsKeyword(message, jeeKeywords)) {
      "JEE (Joint Entrance Examination) is an entrance exam for engineering courses in India. Prepare well for Math, Physics, and Chemistry.";
    } else if (containsKeyword(message, neetKeywords)) {
      "NEET (National Eligibility cum Entrance Test) is for medical career aspirants. Focus on Biology, Physics, and Chemistry.";
    } else if (containsKeyword(message, scholarshipsKeywords)) {
      "Discover available scholarships and financial aid options to support your education.";
    } else if (containsKeyword(message, internshipsKeywords)) {
      "Explore internship opportunities to gain practical experience in your field of interest.";
    } else if (containsKeyword(message, studyTipsKeywords)) {
      "Effective study tips: Create a schedule, practice regularly, take breaks, and seek guidance.";
    } else if (containsKeyword(message, examPrepKeywords)) {
      "To prepare for exams, familiarize yourself with the exam pattern, practice mock tests, and review key concepts.";
    } else if (containsKeyword(message, streamSelectionKeywords)) {
      "If you're unsure about your stream, take career guidance assessments. Consider your interests.";
    } else if (containsKeyword(message, subjectsKeywords)) {
      "Choose subjects based on your strengths and long-term goals. Seek a balance between core and electives.";
    } else if (containsKeyword(message, collegeAdmissionKeywords)) {
      "The college admission process involves submitting applications, entrance exams, and interviews.";
    } else if (containsKeyword(message, mathematicsKeywords)) {
      "Mathematics is a key subject for engineering and science fields. Practice regularly.";
    } else if (containsKeyword(message, biologyKeywords)) {
      "Biology is essential for medical and life sciences. Study cell biology, genetics, and anatomy.";
    } else if (containsKeyword(message, physicsKeywords)) {
      "Physics forms the foundation for engineering and scientific research.";
    } else if (containsKeyword(message, chemistryKeywords)) {
      "Chemistry is vital for medical, chemical, and research careers. Focus on organic, inorganic, and physical chemistry.";
    } else if (containsKeyword(message, computerScienceKeywords)) {
      "Computer Science offers a rewarding career with high demand. Learn programming languages and algorithms.";
    } else if (containsKeyword(message, historyKeywords)) {
      "History is a fascinating field that involves understanding and analyzing the past.";
    } else if (containsKeyword(message, economicsKeywords)) {
      "Economics is important for understanding and making decisions in business. Study microeconomics, macroeconomics, and finance.";
    } else {
      "Thanks for reaching out! Please specify your question or ask for guidance. I'm here to help with your educational and career goals.";
    };
  };

  public shared ({ caller }) func sendMessageToChatbot(message : Text) : async ChatMessage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can chat with chatbot");
    };

    let responseMessage = getChatbotResponse(message);

    let chatMessage : ChatMessage = {
      sender = "User";
      message;
      timestamp = Time.now();
    };

    let chatbotMessage : ChatMessage = {
      sender = "Chatbot";
      message = responseMessage;
      timestamp = Time.now();
    };

    let currentSession = switch (chatSessions.get(caller)) {
      case (null) {
        let messagesList = List.empty<ChatMessage>();
        messagesList.add(chatMessage);
        messagesList.add(chatbotMessage);
        {
          messages = messagesList;
          created = Time.now();
        };
      };
      case (?session) {
        session.messages.add(chatMessage);
        session.messages.add(chatbotMessage);
        session;
      };
    };

    chatSessions.add(caller, currentSession);
    chatbotMessage;
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chat history");
    };
    switch (chatSessions.get(caller)) {
      case (null) { [] };
      case (?session) { session.messages.toArray() };
    };
  };

  public query ({ caller }) func getLastMessage() : async ?ChatMessage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chat history");
    };
    switch (chatSessions.get(caller)) {
      case (null) { null };
      case (?session) {
        if (session.messages.size() == 0) { return null };
        let messagesArray = session.messages.toArray();
        ?messagesArray[messagesArray.size() - 1];
      };
    };
  };
};
