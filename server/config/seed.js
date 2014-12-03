/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Submission = require('../api/submission/submission.model');
var Subformtext = require('../api/subformtext/subformtext.model');
var Status = require('../api/status/status.model');

//Not working code, scrapped to use on a later date
//      -Nic, (11/9)
Status.find({}).remove(function() {
    Status.create({
        strict: "Accepted",
        color: {red: 0, green: 255, blue: 0, alpha: 1},
        emailSubject: "URS submission update",
        emailBody:  ", Your URS submission has been approved, congratulations!",
        priority: 15,
        required: true
    },{
        strict: "Revisions Needed",
        color: {red: 0, green: 100, blue: 255, alpha: 1},
        emailSubject: "URS submission update",
        emailBody: ", Your URS submission has been flagged for revisions, and is in need of changes.",
        priority: 3,
        required: false
    },{
        strict: "Reviewing in Process",
        color: {red: 255, green: 220, blue: 10, alpha: 1},
        emailSubject: "URS submission update",
        emailBody: ", Your URS submission has been approved by your adviser.",
        priority: 2,
        required: false
    },{
        strict: "Awaiting Adviser Approval",
        color: {red: 255, green: 0, blue: 0, alpha: 1},
        emailSubject: "URS submission update",
        emailBody: ", Your URS submission is pending approval from your adviser.",
        priority: -15,
        required: true
    },{
        strict: "Withdrawn",
        color: {red: 70, green: 70, blue: 70, alpha: 1},
        emailSubject: "URS submission update",
        emailBody: ", Your URS submission has either been rejected by your adviser or been withdrawn.",
        priority: 14,
        required: true
    });
});

Subformtext.find({}).remove(function() {
    Subformtext.create({
        title: "2015 URS Submission Form",
        adviserDisclaimer: "All applications to the Undergraduate Research Symposium must be accompanied by a brief statement of support from the student's project adviser." +
            "\nThe faculty mentor should indicate:" +
            "\n* Confidence that the student's work will be ready to present by the URS date." +
            "\n* Approval of the submitted abstract/statement/proposal for publication as-is in the program book." +
            "\nProject adviser recommendations should complete the form prior to the student submitting their abstract for review.",
        ursSummary: "The UMM Undergraduate Research Symposium is a forum for UMM students to present their research, creative, and scholarly work representing the Divisions of Education," +
            "\nHumanities, Science and Mathematics, and Social Sciences at UMM. Accordingly, submissions from students enrolled at other institutions will not be accepted.",
        notes1: "",
        nameDisclaimer: "Your username (x500) will be recorded when you submit this form.",
        header1: "URS submission descriptions:",
        criteria:"General Criteria:" +
            "\nAll submissions should be no more than 250 words and should contain the following elements:" +
            "\n1. A concise explanation of the creative or scholarly implications of the project. What is the creative/intellectual context of your work?" +
            "\n2. Language that is clear and comprehensible to those who are not experts in the field." +
            "\n3. Professional tone, including appropriate word choice and correct grammar, spelling, and punctuation.",
        header2: "Field-specific criteria:",
        notes2: "Mark the category below that best describes your project. Your 250-word submission must also include the appropriate field-specific elements listed below.",
        artistCriteria:
            "1. A concise explanation of the subject matter or concepts you are exploring (what you do)." +
            "\n2. A concise explanation of artistic goals (why you do what you do)." +
            "\n3. A concise explanation of processes, production methods, tools, media, innovations, etc. (how you do what you do)." +
            "\n4. A concise explanation of historical context, including how this work builds on, differs from, or responds to existing work or performances.",
        humanitiesCriteria:
            "1. A concise explanation of the relevant intellectual and scholarly context of your work." +
            "\n2. A concise explanation of how your project fits within this intellectual context. Does it extend, revise, or complicate, or provide a new way of looking at existing work in the field?" +
            "\n3. A clear statement of argument: a specific, debatable claim, not merely a summary of others’ research." +
            "\n4. An explanation of the significance and broader implications of your work.",
        scienceCriteria:
            "1. A concise explanation of the scholarly context for the project with a statement of the project’s specific objective." +
            "\n2. A clear explanation of the methods used to address the objective." +
            "\n3. A clear explanation of the results or findings." +
            "\n4. An explanation of the significance and broader implications of the project's results.",
        notes3: "If you are unsure which category best fits your project, please consult your faculty sponsor.",
        submissionTitle: "Presentation Title: ",
        submissionFormat: "Format for submission: ",
        submissionAbstract: "Artist Statement / Proposal / Abstract ",
        submissionAbstractNotes: "Paste your text in the box below. Figures and special characters will need to be submitted as a separate document. Please e-mail as a Word or PDF document to sferrian@morris.umn.edu" +
            "\n1000 character limit, approx. 250 words.",
        submissionPresentationType: "Type of Presentation",
        submissionFormatChange: "Because of space constraints, we may not be able to have everyone do their preferred type of presentation." +
            "\nIf necessary, would you be willing to give your presentation in another format?",
        submissionChangeNotes: "No change in format will be made without first contacting the presenter first.",
        submissionPresenter: "Primary Presenter:",
        submissionCopresenterOne: "Secondary Presenter #1:",
        submissionCopresenterTwo: "Secondary Presenter #2:",
        submissionSponsors: "Sponsoring Organization or Fund",
        submissionSponsorsNotes: "Choose any applicable. If funded by faculty grant, specify under 'other' ",
        submissionAdviser: "Faculty Sponsor / Project Adviser Information",
        submissionAdviserNotes: "Every submitted project is required to have a faculty sponsor or project adviser identified.",
        submissionFeatured: "The URS features one presentation in the opening ceremony. This presentation should have broader appeal with interdisciplinary components, and may easily accommodate a performance component. The featured presenter will have more time, as well as a bigger room than regular presentations. Would you be interested in having your presentation featured during the opening ceremony? ",
        submissionMediaServices: "Each presentation room will have available an overhead projector and a Macintosh or PC computer with video projection capabilities. Do you anticipate needing any additional Media Services equipment? Please explain in detail: ",
        submissionSpecialRequirements: "Do you anticipate any special room location, non-media services equipment (i.e., recital hall, piano, etc.), or scheduling requirements (i.e., several groups holding a forum that would require more than the allotted 15 minutes)? Please explain in detail: ",
        submissionTee: "T-Shirt for PRIMARY PRESENTER ",
        submissionTeeNotes: "All sizes are US adult sizes",
        submissionOther: "Is there anything else you would like us to know about your presentation?"
    });
});

User.find({}).remove(function() {
    User.create({
            name: 'Matthew Kangas',
            email: 'kanga139@morris.umn.edu',
            provider: 'google',
            google: {
                hd: 'morris.umn.edu',
                locale: "en",
                gender: "male",
                picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
                link: "https://plus.google.com/112639306116346340748",
                family_name: 'Kangas',
                given_name: 'Matthew',
                name: "Matthew Kangas",
                verified_email: true,
                email: 'kanga139@morris.umn.edu',
                id:"112564589444054176387"
            },
            group: -1,
            role: "chair",
            __v: 0
        }, {
            name: "Maggie Casale",
            email: "casal033@morris.umn.edu",
            provider: "google",
            google: {
                hd: "morris.umn.edu",
                locale: "en",
                gender: "female",
                picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
                link: "https://plus.google.com/116234824364241021424",
                family_name: "Casale",
                given_name: "Maggie",
                name: "Maggie Casale",
                verified_email: true,
                email: "casal033@morris.umn.edu",
                id: "116234824364241021424"
            },
            group: -1,
            role: "user",
            __v: 0
        }, {
            name: "Jacob Opdahl",
            email: "opdah023@morris.umn.edu",
            provider: "google",
            google: {
                hd: "morris.umn.edu",
                locale: "en",
                picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
                family_name: "Opdahl",
                given_name: "Jacob",
                name: "Jacob Opdahl",
                verified_email: true,
                email: "opdah023@morris.umn.edu",
                id: "111717955914079275928"
            },
            group: -1,
            role: "admin",
            __v: 0
        }, {
            name: "Joseph Thelen",
            email: "thele116@morris.umn.edu",
            provider: "google",
            google: {
                hd: "morris.umn.edu",
                locale: "en",
                picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
                family_name: "Thelen",
                given_name: "Joseph",
                name: "Joseph Thelen",
                verified_email: true,
                email: "thele116@morris.umn.edu",
                id: "114952307600153399103"
            },
            group: -1,
            role: "admin",
            __v: 0
        }, {
            name: "Kristin Lamberty",
            email: "lamberty@morris.umn.edu",
            provider: "google",
            google: {
                hd: "morris.umn.edu",
                locale: "en",
                gender: "female",
                picture: "https://lh4.googleusercontent.com/-ITWyrX1vG2U/AAAAAAAAAAI/AAAAAAAAAC4/N3Iu5cfi5qo/photo.jpg",
                link: "https://plus.google.com/106035767984054160101",
                family_name: "Lamberty",
                given_name: "Kristin",
                name: "Kristin Lamberty",
                verified_email: true,
                email: "lamberty@morris.umn.edu",
                id: "106035767984054160101"
            },
            group: -1,
            role: "admin",
            __v: 0
        }, {
            provider: 'local',
            role: 'user',
            name: 'User',
            email: 'test@test.com',
            password: 'test',
            group: -1
        }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            tShirtSize: "Medium",
            password: 'admin',
            group: -1
        }, {
            provider: 'local',
            role: 'chair',
            name: 'Chair',
            email: 'chair@chair.com',
            password: 'chair',
            group: -1
        }, {
            provider: 'local',
            role: 'reviewer',
            name: 'Reviewer3',
            email: 'reviewer@reviewer.com',
            password: 'reviewer',
            group: 3
        }, function () {
            console.log('finished populating users');
        }, {
            name: 'Dalton Gusaas',
            email: 'gusaa004@morris.umn.edu',
            tShirtSize: "Medium",
            provider: 'google',
            google: {
                hd: 'morris.umn.edu',
                locale: "en",
                gender: "male",
                picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
                link: "https://plus.google.com/105501894365476440976",
                family_name: 'Gusaas',
                given_name: 'Dalton',
                name: "Dalton Gusaas",
                verified_email: true,
                email: 'gusaa004@morris.umn.edu',
                id: '105501894365476440976'
            },
            group: 2,
            role: "reviewer",
            __v: 0
        }
    );
});

Submission.find({}).remove(function(){
    Submission.create({
        title: "On Your March, Get Set, Rust!",
        format: "Science or Social Science Abstract",
        abstract: "The title of my project is called On Your March, Get Set, Rust! " +
            "The purpose of my experiment was to find out if salt water rusts nails faster than freshwater and which type of nails, " +
            "galvanized or common will rust quickly.The procedure involved sanding ten galvanized and common nails." +
            "The nails were placed in glass jars and added with 150mL of water mixed with 15mL of salt. The experiment was observed for two weeks. " +
            "The amount of rust was recorded on both types of nails. I repeated these steps for two types of nails in freshwater. " +
            "My results of my data resolves that galvanized and common nails in freshwater had a higher average or rust than the other nails in salt water. " +
            "My data also concludes that the rusting color was black. In conclusion the nails in freshwater rusted more than the nails in saltwater. " +
            "Saltwater may rust something faster than freshwater, but salt contains sodium chloride in which it causes the nails in saltwater to rust at a slower rate.",
        presentationType: "Oral Presentation",
        formatChange: true,
        presenterInfo: {first: "Emma", last: "Sax", email: "saxxx027@morris.umn.edu"},
        copresenterOneInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "Chemistry",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Joseph", last: "Thelen", email: "thele116@morris.umn.edu"},
        featured: false,
        mediaServicesEquipment: "",
        specialRequirements: "",
        presenterTeeSize: "L",
        otherInfo: "",
        approval: false,
        rejection: false,
        status:  {strict: "Awaiting Adviser Approval", text: "Your adviser has yet to approve this submission."},
        timestamp: "Sat Oct 18 2014 10:48:54 GMT-0500 (CDT)",
        group: 0,
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: []
    }, {
        title: "Blind Construction: Mixed Media",
        format: "Artist Statement",
        abstract: "The basis of this project was to create a garment using mixed media in order to mimic the human body. " +
            "The materials we used to create this piece include: buckram, copper wire, spray paint, fabric paint, a variety of novelty fabrics, and chains.  " +
            "The techniques we created in order to manipulate the piece include: fabric branding and burning, grid painting, sewing, draping, molding buckram, and coiling.  " +
            "Our overall approach was to create a theatrical wearable art piece. " +
            "Upon completion of the assignment we found the piece aesthetically pleasing because of the way it molds to the human body, but can be a piece all on its own.",
        presentationType: "Performance",
        formatChange: false,
        presenterInfo: {first: "Jacob", last: "Opdahl", email: "opdah023@morris.umn.edu"},
        copresenterOneInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
        copresenterTwoInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
        discipline: "Art History",
        sponsors: [],
        adviserInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
        featured: true,
        mediaServicesEquipment: "",
        specialRequirements: "A space to perform with three people.",
        presenterTeeSize: "M",
        otherInfo: "",
        approval: true,
        rejection: false,
        status: {strict: "Revisions Needed", text: "Your URS submission has been flagged for revisions, and is in need of changes."},
        timestamp: "Tue Oct 21 2014 23:22:54 GMT-0500 (CDT)",
        group: 1,
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments:[]

    }, {
        title: "On the Migration of Majestic Space Whales",
        format: "Artist Statement",
        abstract: "They swim through the endless void, without care and knowing not the concept of time." +
            "Through the study of these great beats we can come to better know not only their migration patterns," +
            "but ourselves as well. Throughout time humanity has sought answers, be it through science, religion, or otherwise." +
            "No matter the path of exploration, the fact remains that we always look to the stars. In this ground breaking research" +
            "we will delve deep into the life of the majestic space whale. Discovered only recently, these grand creatures meander aimlessly" +
            "throughout the stars, living millions of years. Through the study of their migration patterns, we can gain insight into interstellar travel" +
            "and means by which life can be sustained in a vacuum. Although the focus of this research is on the migration patterns of these" +
            "great beasts and their applicability to commercial space travel, during our research we were privileged to witness the death of" +
            "a space whale, and we would be wrong not to make note of the event. From what we know, a space whale gradually grows in size over the course of it's" +
            "life, as is the case with many animals we are already familiar with. However, the lack of gravity in space allows the space whale to grow in size seemingly without" +
            "limit. Eventually, provided it is not killed by other means, a space whale will reach a size where it develops a noticeable gravity of it's own. Once this " +
            "happens layers of dust and rock will begin to collect upon the space whale until eventually the space whale is rendered unable to feed, or is crushed to death.",
        presentationType: "Performance",
        formatChange: false,
        presenterInfo: {first: "Joseph", last: "Thelen", email: "thele116@morris.umn.edu"},
        copresenterOneInfo: {first: "Jacob", last: "Opdahl", email: "opdah023@morris.umn.edu"},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "Biology",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Peter",last: "Hans", email: "hans4858@morris.umn.edu"},
        featured: true,
        mediaServicesEquipment: "Microphone for my sick rhymes, 5 laser stage lights with automated gimbals.",
        specialRequirements: "A whale suit.",
        presenterTeeSize: "XL",
        otherInfo: "yes.",
        approval: false,
        rejection: false,
        status: {strict: "Awaiting Adviser Approval", text: "Your adviser has yet to approve this submission."},
        timestamp: "Mon Sept 2 2014 1:48:54 GMT-0500 (CDT)",
        group: 1,
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: []
    }, {
        title: "The Commemoration and Memorialization of the American Revolution",
        format: "Artist Statement",
        abstract: "This project involves discovering how the American Revolution was remembered during the nineteenth century.  " +
            "The goal is to show that the American Revolution was memorialized by the actions of the United States government during the 1800s. " +
            "This has been done by examining events such as the Supreme Court cases of John Marshall and the Nullification Crisis. " +
            "Upon examination of these events, it becomes clear that John Marshall and John Calhoun (creator of the Doctrine of Nullification) " +
            "attempted to use the American Revolution to bolster their claims by citing speeches from Founding Fathers. " +
            "Through showing that the American Revolution lives on in memory, " +
            "this research highlights the importance of the revolution in shaping the actions of the United States government.",
        presentationType: "Performance",
        formatChange: false,
        presenterInfo: {first: "Mitchell", last: "Finzel", email: "finze008@morris.umn.edu"},
        copresenterOneInfo: {first: "Brandon", last: "Moody", email: "moody107@morris.umn.edu"},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "History",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Niccolas", last: "Ricci", email: "saxxx027@morris.umn.edu"},
        //ricc0082@morris.umn.edu
        featured: true,
        mediaServicesEquipment: "A way to show images, either a projector or a warning so I can print them.",
        specialRequirements: "",
        presenterTeeSize: "XL",
        otherInfo: "yes.",
        approval: true,
        rejection: false,
        status: {strict: "Reviewing in Process", text: "Your URS submission has been approved by your adviser"},
        timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
        group: 3,
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: []
    }, {
        title: "Margaret C. Anderson’s Little Review",
        format: "Social Science",
        abstract: "This research looks at the work of Margaret C. Anderson, the editor of the Little Review.  " +
            "The review published first works by Sherwood Anderson, James Joyce, Wyndham Lewis, and Ezra Pound.  " +
            "This research draws upon mostly primary sources including memoirs, published letters, and a complete collection of the Little Review. " +
            "Most prior research on Anderson focsal033@morris.umn.eduuses on her connection to the famous writers and personalities that she published and associated with.  " +
            "This focus undermines her role as the dominant creative force behind one of the most influential little magazines published in the 20th Century. " +
            "This case example shows how little magazine publishing is arguably a literary art.",
        presentationType: "Poster or Visual Display",
        formatChange: true,
        presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
        copresenterOneInfo: {first: "", last: "", email: ""},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "English",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
        featured: true,
        mediaServicesEquipment: "",
        specialRequirements: "A small space to make the presentation personal.",
        presenterTeeSize: "S",
        otherInfo: "yes.",
        approval: true,
        rejection: false,
        status: {strict: "Accepted", text: "Your URS submission has been approved, congratulations!"},
        timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
        group: 2,
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: []
    }, {
        title: "A Study of the Properties of a Paperclip in the Digestive System of a Sloth",
        format: "Artist Statement",
        abstract: "Many physicists would agree that, had it not been for scatter/gather I/O, the study of link-level acknowledgements might never have occurred. " +
            "While such a claim might seem unexpected, it usually conflicts with the need to provide thin clients to hackers worldwide. " +
            "In fact, few security experts would disagree with the construction of kernels. In order to overcome this question, we construct an analysis of the Ethernet (Mollah)," +
            " which we use to prove that redundancy and replication can interfere to achieve this aim. ",
        presentationType: "Oral Presentation",
        formatChange: false,
        presenterInfo: {first: "Hongya", last: "Zhou", email: "zhoux616@morris.umn.edu"},
        copresenterOneInfo: {first: "Otto", last: "Marckel II", email: "marck018@morris.umn.edu"},
        copresenterTwoInfo: {first: "Dalton", last: "Gusaas", email: "gusaa004@morris.umn.edu"},
        discipline: "Biology",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
        featured: false,
        mediaServicesEquipment: "",
        specialRequirements: "a sloth",
        presenterTeeSize: "M",
        otherInfo: "Maybe",
        approval: false,
        rejection: false,
        cc: true,
        status: {strict: "Awaiting Adviser Approval", text: "Your adviser has yet to approve this submission."},
        timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
        group: 3,
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: []
    });
});