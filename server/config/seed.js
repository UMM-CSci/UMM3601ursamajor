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
        emailSubject: "URS submission has been accepted",
        emailBody:  ", Your URS submission has been approved, congratulations!",
        //only change this priority if you change the function in abstractBook.controller
        priority: 15,
        required: true
    },{
        strict: "Revisions Needed",
        color: {red: 255, green: 255, blue: 0, alpha: 1},
        emailSubject: "URS submission needs revisions",
        emailBody: ", Your URS submission has been flagged for revisions, and is in need of changes.",
        priority: 3,
        required: false
    },{
        strict: "Reviewing in Process",
        color: {red: 0, green: 100, blue: 255, alpha: 1},
        emailSubject: "URS submission is being reviewed",
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
        color: {red: 120, green: 120, blue: 120, alpha: 1},
        emailSubject: "URS submission has been withdrawn",
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
        submissionAdviser: "Primary Faculty Sponsor / Project Adviser Information",
        submissionAdviserNotes: "Every submitted project is required to have at least one faculty sponsor or project adviser identified.",
        submissionCoadviserOne: "Secondary Adviser #1:",
        submissionCoadviserTwo: "Secondary Adviser #2:",
        submissionFeatured: "The URS features one presentation in the opening ceremony. This presentation should have broader appeal with interdisciplinary components, and may easily accommodate a performance component. The featured presenter will have more time, as well as a bigger room than regular presentations. Would you be interested in having your presentation featured during the opening ceremony? ",
        submissionMediaServices: "Each presentation room will have available an overhead projector and a Macintosh or PC computer with video projection capabilities. Do you anticipate needing any additional Media Services equipment? Please explain in detail: ",
        submissionSpecialRequirements: "Do you anticipate any special room location, non-media services equipment (i.e., recital hall, piano, etc.), or scheduling requirements (i.e., several groups holding a forum that would require more than the allotted 15 minutes)? Please explain in detail: ",
        //submissionTee: "T-Shirt for PRIMARY PRESENTER ",
        //submissionTeeNotes: "All sizes are US adult sizes",
        submissionOther: "Is there anything else you would like us to know about your presentation?"
    });
});

User.find({}).remove(function() {
    User.create({
            name: 'Matthew Kangas',
            email: 'kanga139@morris.umn.edu',
            tShirtSize: "XXXLarge",
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
            group: 1,
            role: "reviewer",
            __v: 0
        }, {
            name: "Mitchell Finzel",
            email: "finze008@morris.umn.edu",
            provider: "google",
            google: {
              hd: "morris.umn.edu",
              locale: "en",
              gender: "male",
              picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
              link: "https://plus.google.com/1126393061163463407484",
              family_name: "Finzel",
              given_name: "Mitchell",
              name: "Mitchell Finzel",
              verified_email: true,
              email: "finze008@morris.umn.edu",
              id: "112639306116346340748"
            },
            group: -1,
            role: "user",
           __v: 0
        }, {
            name: "Mark Lehet",
            email: "lehet005@morris.umn.edu",
            provider: "google",
            google: {
                hd: "morris.umn.edu",
                locale: "en",
                gender: "male",
                picture: "https://lh6.googleusercontent.com/-ismwlkS7xqs/AAAAAAAAAAI/AAAAAAAAABI/j0NXKAx-4GU/photo.jpg",
                link: "https://plus.google.com/102737466880551658774",
                family_name: "Lehet",
                given_name: "Mark",
                name: "Mark Lehet",
                verified_email: true,
                email: "lehet005@morris.umn.edu",
                id: "102737466880551658774"
            },
            group: -1,
            role: "user",
            __v: 0
      }, {
            name: "Maggie Casale",
            email: "casal033@morris.umn.edu",
            tShirtSize: "Small",
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
            role: "chair",
            __v: 0
        }, {
            name: "Jacob Opdahl",
            email: "opdah023@morris.umn.edu",
            tShirtSize: "Medium",
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
            tShirtSize: "XLarge",
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
            role: "user",
            __v: 0
        }, {
            name: "Kristin Lamberty",
            email: "lamberty@morris.umn.edu",
            tShirtSize: "Medium",
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
            tShirtSize: "XLarge",
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
            tShirtSize: "Small",
            password: 'chair',
            group: -1
        }, {
            provider: 'local',
            role: 'reviewer',
            name: 'Reviewer',
            email: 'reviewer@reviewer.com',
            tShirtSize: "XXLarge",
            password: 'reviewer',
            group: 3
        }, function () {
            console.log('finished populating users');
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
        presenterInfo: {first: "Joseph", last: "Thelen", email: "thele116@morris.umn.edu"},
        copresenterOneInfo: {first: "", last: "", email: ""},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "Chemistry",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Hongya", last: "Zhou", email: "zhou616@morris.umn.edu"},
        coadviserOneInfo: {first: "", last: "", email: ""},
        coadviserTwoInfo: {first: "", last: "", email: ""},
        featured: false,
        mediaServicesEquipment: "",
        specialRequirements: "",
//        presenterTeeSize: "L",
        otherInfo: "",
        approval: true,
        cc: false,
        rejection: false,
        status:  {strict: "Reviewing in Process", priority: 2, text: "Your URS submission has been approved by your adviser."},
        timestamp: "Sat Oct 18 2014 10:48:54 GMT-0500 (CDT)",
        group: 0,
        roomAssignment: "Science 2610",
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: [
            {
                beginner: 0,
                ender: 64,
                commentText:"You don't need to restate the title of the submission...",
                commenter: "Hongya Zhou",
                selectionText : "The title of my project is called On Your March, Get Set, Rust! ",
                indicator : 0,
                timestamp : "Mon Dec 08 2014 18:41:16 GMT-0600 (CST)",
                origin : "5486429c6adf9b0859cb58c7",
                responses: []
            }, {
                beginner: 245 ,
                ender: 284 ,
                commentText: "Why were they sanded?" ,
                commenter: "Hongya Zhou" ,
                selectionText: "sanding ten galvanized and common nails" ,
                indicator: 0 ,
                timestamp: "Mon Dec 08 2014 18:42:05 GMT-0600 (CST)" ,
                origin: "5486429c6adf9b0859cb58c7" ,
                responses: [
                    {
                        "response": "Obviously to release the magical nail spirits.",
                        "responder": "Hongya Zhou",
                        "timestamp": "Mon Dec 08 2014 19:03:17 GMT-0600 (CST)"
                    }
                ]
            }, {
                beginner: 161 ,
                ender: 222 ,
                commentText: "Poorly worded. Should be \"more quickly\" ?" ,
                commenter: "Hongya Zhou" ,
                selectionText: " which type of nails, galvanized or common will rust quickly." ,
                indicator: 0 ,
                timestamp: "Mon Dec 08 2014 18:43:43 GMT-0600 (CST)" ,
                origin: "5486429c6adf9b0859cb58c7" ,
                responses: [ ]
            }, {
                beginner: 536 ,
                ender: 678 ,
                commentText: "Big portion needs re-write..." ,
                commenter: "Hongya Zhou" ,
                selectionText: "My results of my data resolves that galvanized and common nails in freshwater had a higher average or rust than the other nails in salt water." ,
                indicator: 0 ,
                timestamp: "Mon Dec 08 2014 18:44:47 GMT-0600 (CST)" ,
                origin: "5486429c6adf9b0859cb58c7" ,
                responses: [
                    {
                        response: "But WHYYYYY?" ,
                        responder: "Hongya Zhou" ,
                        timestamp: "Mon Dec 08 2014 18:52:18 GMT-0600 (CST)"
                    }
                ]
            }
        ],
        reviewVotes: {
            Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
            Minor: [],
            Major: [],
            TotalRewrite: []
        }


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
        presenterInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
        copresenterOneInfo: {first: "Joseph", last: "Thelen", email: "thele116@morris.umn.edu"},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "Art History",
        sponsors: [],
        adviserInfo: {first: "Matt", last: "Kangas", email: "kanga139@morris.umn.edu"},
        coadviserOneInfo: {first: "", last: "", email: ""},
        coadviserTwoInfo: {first: "", last: "", email: ""},
        featured: true,
        mediaServicesEquipment: "",
        specialRequirements: "A space to perform with three people.",
//        presenterTeeSize: "M",
        otherInfo: "",
        approval: true,
        cc: false,
        rejection: false,
        status: {strict: "Revisions Needed", priority: 3, text: "Your URS submission has been flagged for revisions, and is in need of changes."},
        timestamp: "Tue Oct 21 2014 23:22:54 GMT-0500 (CDT)",
        group: 1,
        roomAssignment: "Imholte 109",
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments:[],
        reviewVotes: {
            Accepted: [],
            Minor: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
            Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
            TotalRewrite: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}]
        }

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
        presenterInfo: {first: "Jacob", last: "Opdahl", email: "opdah023@morris.umn.edu"},
        copresenterOneInfo: {first: "", last: "", email: ""},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "Biology",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Maggie",last: "Casale", email: "casal033@morris.umn.edu"},
        coadviserOneInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
        coadviserTwoInfo: {first: "Emma", last: "Sax", email: "saxxx027@morris.umn.edu"},
        featured: true,
        mediaServicesEquipment: "Microphone for my sick rhymes, 5 laser stage lights with automated gimbals.",
        specialRequirements: "A whale suit.",
//        presenterTeeSize: "XL",
        otherInfo: "I was planning on bringing a 1/10 size scale blue whale inflatable. Are there any rooms with room for this?",
        approval: true,
        cc: false,
        rejection: false,
        status: {strict: "Reviewing in Process", priority: 2, text: "Your URS submission has been approved by your adviser."},
        timestamp: "Mon Sept 2 2014 1:48:54 GMT-0500 (CDT)",
        group: 1,
        roomAssignment: "Science 2610",
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: [],
        reviewVotes: {
            Accepted: [],
            Minor: [],
            Major: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}, {name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}, {name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
            TotalRewrite: []
        }
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
        presenterInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
        copresenterOneInfo: {first: "Brandon", last: "Moody", email: "moody107@morris.umn.edu"},
        copresenterTwoInfo: {first: "", last: "", email: ""},
        discipline: "History",
        sponsors: [], //Might need to worry about if this is static for the DB later.
        adviserInfo: {first: "Emma", last: "Sax", email: "saxxx027@morris.umn.edu"},
        coadviserOneInfo: {first: "", last: "", email: ""},
        coadviserTwoInfo: {first: "", last: "", email: ""},
        featured: true,
        mediaServicesEquipment: "A way to show images, either a projector or a warning so I can print them.",
        specialRequirements: "",
//        presenterTeeSize: "XL",
        otherInfo: "yes.",
        approval: true,
        cc: false,
        rejection: false,
        status: {strict: "Reviewing in Process", priority: 2, text: "Your URS submission has been approved by your adviser"},
        timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
        group: 3,
        roomAssignment: "Science 2610",
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: [],
        reviewVotes: {
            Accepted: [],
            Minor: [],
            Major: [],
            TotalRewrite: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}, {name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}]
        }
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
        adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
        coadviserOneInfo: {first: "", last: "", email: ""},
        coadviserTwoInfo: {first: "", last: "", email: ""},
        featured: true,
        mediaServicesEquipment: "",
        specialRequirements: "A small space to make the presentation personal.",
//        presenterTeeSize: "S",
        otherInfo: "yes.",
        approval: true,
        cc: false,
        rejection: false,
        status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
        timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
        group: 2,
        roomAssignment: "Science 2610",
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: [],
        reviewVotes: {
            Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
            Minor: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
            Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
            TotalRewrite: []
        }
    },{
      title: "1,2,3,...Pull! Which Parachute Materials",
      format: "Science or Social Science Abstract",
      abstract: "The purpose of this investigation is to determine, from the samples that were given to me by several companies, which parachute will descend at the slowest rate. " +
          "Making it the safest. I plan to make three parachutes out of the 9 materials given to me. That will give me 27 parachutes. " +
          "They will be wing-shaped and will be 39cm in width and 20cm in length. Then I will cut 108 pieces of kite string that are going to be 40cm a piece. " +
          "Now tape 4 strings to the four corners, then tie the ends together. Then take 2 pennies and tape them to the tied ends. Now do the same for the other parachutes. " +
          "Find a high place off the ground like a stairway or ladder so you can drop the parachutes. Now measure out 8 feet. Make sure the area at the bottom is flat. " +
          "Take your first parachute drop it, and time it as it descends. Stop when it hits the ground. Repeat this step ten times a piece for each parachute. So you can validate your results. " +
          "Record the data. Previously, I have found that a parachute by the name of Tandem Icarus seemed to descend at the slowest rate. " +
          "But this year I have added three more parachutes to my research. So far, a parachute by the name of Prima is descending at the slower rate. " +
          "I hope that this will enable my project to produce more accurate data. ",
      presentationType: "Poster or Visual Display",
      formatChange: true,
      presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
      copresenterOneInfo: {first: "", last: "", email: ""},
      copresenterTwoInfo: {first: "", last: "", email: ""},
      discipline: "Biology",
      sponsors: [], //Might need to worry about if this is static for the DB later.
      adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
      coadviserOneInfo: {first: "", last: "", email: ""},
      coadviserTwoInfo: {first: "", last: "", email: ""},
      featured: true,
      mediaServicesEquipment: "",
      specialRequirements: "A small space to make the presentation personal.",
//        presenterTeeSize: "S",
      otherInfo: "yes.",
      approval: true,
      cc: false,
      rejection: false,
      status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
      timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
      group: 2,
      roomAssignment: "Science 2610",
      resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
      comments: [],
      reviewVotes: {
        Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
        Minor: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
        Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
        TotalRewrite: []
      }
    },{
      title: "Development by Design and Testing of a Miniature to Harness Kinetic Energy from Airflow Around a Moving Automobile",
      format: "Science or Social Science Abstract",
      abstract: "This project presents a summary of a successful design, fabrication and testing of wind turbines mounted on a car roof for the purpose of extracting power from the kinetic energy (dynamic pressure) contained in the wind flow around the car. " +
          "The placement of the turbine was based on aerodynamic considerations. Various design concepts were tested and evaluated. Drag tests were conducted that showed the turbine did not negatively impact vehicle performance. " +
          "NACA (National Advisory Committee for Aeronautics) ducts were evaluated and shown to offer additional choice for turbine design and placement. " +
          "The results obtained from the tests conducted in this research demonstrate the feasibility for the efficient extraction of energy from wind flow around an automobile. " +
          "Literature research consisting mainly of a review of NACA reports supported the findings of this study.",
      presentationType: "Poster or Visual Display",
      formatChange: true,
      presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
      copresenterOneInfo: {first: "", last: "", email: ""},
      copresenterTwoInfo: {first: "", last: "", email: ""},
      discipline: "Biology",
      sponsors: [], //Might need to worry about if this is static for the DB later.
      adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
      coadviserOneInfo: {first: "", last: "", email: ""},
      coadviserTwoInfo: {first: "", last: "", email: ""},
      featured: true,
      mediaServicesEquipment: "",
      specialRequirements: "A small space to make the presentation personal.",
//        presenterTeeSize: "S",
      otherInfo: "yes.",
      approval: true,
      cc: false,
      rejection: false,
      status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
      timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
      group: 2,
      roomAssignment: "Science 2610",
      resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
      comments: [],
      reviewVotes: {
        Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
        Minor: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
        Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
        TotalRewrite: []
      }
    },{
      title: "Continued Fractions of Quadratic Laurent Series",
      format: "Science or Social Science Abstract",
      abstract: "It is both natural and interesting to replace the ring of integers and field of real numbers with the ring F[x] and the field F((1/x))for a field F, " +
          "and to try to use continued fractions in F((1/x))to solve Pell’s equation in F[x]. " +
          "I hypothesized that the solvability of Pell’s equation in this context is equivalent to the eventual periodicity of the associated continued fraction " +
          "(a non-trivial constraint for infinite F) and that such periodicity exhibits symmetry properties analogous to the classically studied case. " +
          "I proved my hypothesis, overcoming numerous obstacles not seen in the classical case, such as non-trivial units and lack of order structure. " +
          "The method applies in characteristic 2, using a generalized form of Pell’s equation. The technique of proof is a mixture of non-Archimedean methods and polynomial algebra, " +
          "the central breakthrough being a close study of the properties of a concept that I call a “reduced quadratic surd”. " +
          "After proving some importance technical properties of reduced surd, I show that eventual periodicity of continued fractions implies the specific periodic and symmetric structure analogous to the classical case. " +
          "I then use this result to prove that Pell’s equation has solutions if and only if the associated continued fraction is periodic – a result not seen in the classical theory. " +
          "As a result, the problem of Pell’s equation in F[x] and the periodicity structure of quadratic surds in F((1/x)) is solved for arbitrary coefficient fields F, " +
          "giving us interesting insight into the classical case.",
      presentationType: "Poster or Visual Display",
      formatChange: true,
      presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
      copresenterOneInfo: {first: "", last: "", email: ""},
      copresenterTwoInfo: {first: "", last: "", email: ""},
      discipline: "Biology",
      sponsors: [], //Might need to worry about if this is static for the DB later.
      adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
      coadviserOneInfo: {first: "", last: "", email: ""},
      coadviserTwoInfo: {first: "", last: "", email: ""},
      featured: true,
      mediaServicesEquipment: "",
      specialRequirements: "A small space to make the presentation personal.",
//        presenterTeeSize: "S",
      otherInfo: "yes.",
      approval: true,
      cc: false,
      rejection: false,
      status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
      timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
      group: 2,
      roomAssignment: "Science 2610",
      resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
      comments: [],
      reviewVotes: {
        Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
        Minor: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
        Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
        TotalRewrite: []
      }
    },{
      title: "Synthesis and Evaluation of a Moleculary Imprinted Polymer for the Enantiomeric Resolution of L- and-D- Phenylalanine",
      format: "Science or Social Science Abstract",
      abstract: "Molecularly imprinted polymers (MIPs) are synthesis network polymers that contain recognition sited for specific molecules. " +
          "MIPs are designed to bind the molecule that they have been imprinted with over other structurally similar molecules. " +
          "The goal of this project was to create a beta- Cyclodextrin (BCD) based MIP imprinted with the amino acid L-Phenylalanine (L-Phe) MIPs, " +
          "which are prepared based on relatively weak intermolecular attractions between the template molecule and pre-polymer components, have decreased binding abilities in polar solvents. " +
          "However, to be used in many practical applications in the future, MIPs will need to be able to function in polar solvents such as water. " +
          "In this project, the goal was to synthesize a MIP that could bind L-Phe in an aqueous solution by using the hydrophobic attraction provided by the B-CD cavity. " +
          "MIPs were formed by polymerizing (crosslinking) B-CD with m-xylylene disocyanate (XDI) in the presence of L-Phe (template molecule). " +
          "CuCl2 was used to increase the solubility of L-Phe in DMSO (dimethyl sulfoxide, solvent). Control polymers were formed in the same way, but in the absence of L-Phe and CuCl2. " +
          "All polymers were thoroughly washed and dried to prepare them for rebinding studies and analysis. The polymer obtained from the synthesis described was analyzed with IR spectroscopy, " +
          "and the structure of the polymer was proposed. Due to difficulties in removing background UV-V is absorption caused by the polymer or other contaminants in rebinding study solutions, " +
          "the efficacy of the polymer in binding L-Phe over D-Phe in aqueous media was not confirmed, and will be the focus of future studies.",
      presentationType: "Poster or Visual Display",
      formatChange: true,
      presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
      copresenterOneInfo: {first: "", last: "", email: ""},
      copresenterTwoInfo: {first: "", last: "", email: ""},
      discipline: "Biology",
      sponsors: [], //Might need to worry about if this is static for the DB later.
      adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
      coadviserOneInfo: {first: "", last: "", email: ""},
      coadviserTwoInfo: {first: "", last: "", email: ""},
      featured: true,
      mediaServicesEquipment: "",
      specialRequirements: "A small space to make the presentation personal.",
//        presenterTeeSize: "S",
      otherInfo: "yes.",
      approval: true,
      cc: false,
      rejection: false,
      status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
      timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
      group: 2,
      roomAssignment: "Science 2610",
      resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
      comments: [],
      reviewVotes: {
        Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
        Minor: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
        Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
        TotalRewrite: []
      }
    },{
      title: "The Effect of Motor Oil on Daphnia magna",
      format: "Humanities Proposal",
      abstract: "The purpose of my project was to model how motor oil released to a lake impacts the organisms that live there. " +
          "Whole effluent toxicity (WET) testing is used by regulatory agencies to determine how clean an effluent must be before release to the environment. " +
          "In a WET test, aquatic animals are exposed to an effluent to determine if the effluent harms the animals. " +
          "I conducted eight experiments using the organism Daphnia magna. I added oxygenated, dechlorinated water to sample containers, " +
          "then added varying concentrations of motor oil. For each experiment, two replicates were prepared. " +
          "To each sample, I added Daphnia magna and then recorded the number of organisms alive after 24 and 48 hours. " +
          "Great care was taken to properly maintain the Daphnia magna culture for the experiments. I maintained optimal temperature and lighting and followed the appropriate schedule for feeding and water changes. " +
          "I initially tested motor oil concentrations of 0.2% and higher. When all the Daphnia magna neonates died, I conducted two experiments using NaCl, " +
          "since their response to NaCl is known. When the Daphnia magna reacted as expected, I continued the experiments, eventually using motor oil concentrations as low as 0.00017%. " +
          "Using data from Replicate #1 Experiment #8 24-hour observations, I was able to generate a graph which revealed a motor oil LC50 of 30 mg/l. " +
          "This is the concentration at which 50% of the organisms die. This very low concentration confirms how only a little bit of oil can cause serious damage to the environment.",
      presentationType: "Poster or Visual Display",
      formatChange: true,
      presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
      copresenterOneInfo: {first: "", last: "", email: ""},
      copresenterTwoInfo: {first: "", last: "", email: ""},
      discipline: "Biology",
      sponsors: [], //Might need to worry about if this is static for the DB later.
      adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
      coadviserOneInfo: {first: "", last: "", email: ""},
      coadviserTwoInfo: {first: "", last: "", email: ""},
      featured: true,
      mediaServicesEquipment: "",
      specialRequirements: "A small space to make the presentation personal.",
//        presenterTeeSize: "S",
      otherInfo: "yes.",
      approval: true,
      cc: false,
      rejection: false,
      status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
      timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
      group: 2,
      roomAssignment: "Science 2610",
      resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
      comments: [],
      reviewVotes: {
        Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
        Minor: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
        Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
        TotalRewrite: []
      }
    },{
      title: "English as the Medium of Instruction for Non-Native English Speakers",
      format: "Artisit Statement",
      abstract: "The world is slowly turning into a global village and borders that once stood between cultures now serve as bridges for the enjoyment of diversity between people of different races and ethnicities. " +
          "At the forefront of this change is English, which stands as the global medium of communication. " +
          "This modern renaissance of human interaction may bring about a lot in terms of economics and trade, but adopting English as the national medium of instruction in the grade school and high school levels, " +
          "just to ride this economic wave of change, poses several dangers to the culture of non-native English speakers. " +
          "Apart from inefficiency and stunted cognition, non-native English speaking students are at risk of losing their cultural identity.",
      presentationType: "Poster or Visual Display",
      formatChange: true,
      presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
      copresenterOneInfo: {first: "", last: "", email: ""},
      copresenterTwoInfo: {first: "", last: "", email: ""},
      discipline: "English",
      sponsors: [], //Might need to worry about if this is static for the DB later.
      adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
      coadviserOneInfo: {first: "", last: "", email: ""},
      coadviserTwoInfo: {first: "", last: "", email: ""},
      featured: true,
      mediaServicesEquipment: "",
      specialRequirements: "A small space to make the presentation personal.",
//        presenterTeeSize: "S",
      otherInfo: "yes.",
      approval: true,
      cc: false,
      rejection: false,
      status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
      timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
      group: 2,
      roomAssignment: "Science 2610",
      resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
      comments: [],
      reviewVotes: {
        Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}],
        Minor: [{name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
        Major: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}],
        TotalRewrite: []
      }
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
        adviserInfo: {first: "Otto", last: "Marckell", email: "marck018@morris.umn.edu"},
        coadviserOneInfo: {first: "", last: "", email: ""},
        coadviserTwoInfo: {first: "", last: "", email: ""},
        featured: false,
        mediaServicesEquipment: "",
        specialRequirements: "a sloth",
//        presenterTeeSize: "M",
        otherInfo: "Maybe",
        approval: true,
        rejection: false,
        cc: true,
        status: {strict: "Reviewing in Process", priority: 2, text: "Your URS submission has been approved by your adviser."},
        timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
        group: 3,
        roomAssignment: "HFA 6",
        resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
        comments: [],
        reviewVotes: {
            Accepted: [{name: "Mark Lehet", email:"lehet005@morris.umn.edu"}, {name: "Matthew Kangas", email:"kanga139@morris.umn.edu"}],
            Minor: [],
            Major: [],
            TotalRewrite: [{name: "Jacob Opdahl", email:"opdah023@morris.umn.edu"}]
        }
    });
});
