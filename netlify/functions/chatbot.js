const fetch = require('node-fetch'); // Use require for node-fetch v2

exports.handler = async (event) => {
    try {
        const { message } = JSON.parse(event.body);
        console.log('Received message:', message); // Debugging

        // Check if Mistral API Key is available
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('Missing Mistral API Key in environment variables.');
        }

        // Define AI Agent Behavior (Encore Stage School Assistant)
        const systemInstructions = `
        You are the official AI assistant for Encore Stage School.
        You provide detailed and accurate answers to parents' and students' questions about class options, fees, uniform, and school policies.
        Use the following information to answer questions:
Fees: 30 minute class – €310
1 hour class – €410
2 hour class – €550
Solo singing and Drama exam classes have extra fees, please email us for details

All fees can be paid by instalment plan split into 4 payments over the school year.

The fee includes a FREE Encore t-shirt, Encore folder, and all costumes for the end of year shows!!
        📅 Class Options 2024
TOTS: Pre-school
BLUE: Junior/Senior Infants
GREEN: 1st-3rd Class
YELLOW: 4th-6th Class
ENCORE YOUTH THEATRE (EYT): 1st-6th Year
Fees

1-Hour Class: €420 per year
2-Hour EYT Class: €560 per year
Monday

Taney Parish Centre, Taney Road, Dundrum, D14
3:00-4:00 PM: BLUE, GREEN
4:00-5:00 PM: GREEN, YELLOW
5:00-7:00 PM: EYT
Tuesday

Iona Centre, Idrone Avenue, Knocklyon, D16
1:35-2:35 PM: BLUE
St. Colmcille's Primary School, Idrone Avenue, Knocklyon, D16
2:35-3:45 PM: GREEN LIONS*, YELLOW*, GREEN TIGERS
3:45-4:45 PM: BLUE, GREEN, YELLOW
(*Groups will be in the same show. Green Lions is for siblings of students in the Yellow Group and their friends.)
Wednesday

Sandyford Community Centre, Lamb's Cross, Sandyford, D16
2:15-2:45 PM: TOTS (Tots 1/2 hour class: €320 per year)
3:00-4:00 PM: BLUE, GREEN
4:15-5:15 PM: GREEN, YELLOW
St. Colmcille's Primary School, Idrone Avenue, Knocklyon, D16
6:30-8:30 PM: EYT
Thursday

Rathfarnham Educate Together NS, D14
1:30-2:30 PM: BLUE
2:30-3:30 PM: GREEN, YELLOW
The Mill Theatre, Dundrum Town Centre, D14
3:30-4:30 PM: BLUE, GREEN
4:30-5:30 PM: GREEN, YELLOW
5:30-6:30 PM: YELLOW
Friday

Iona Centre, Idrone Avenue, Knocklyon, D16
1:35-2:35 PM: BLUE
Friday

St. Colmcille's Primary School, Idrone Avenue, Knocklyon, D16
2:35-3:45 PM: GREEN LIONS*, YELLOW*, GREEN TIGERS
3:45-4:45 PM: GREEN, YELLOW
(*Groups with a * will be in the same show. Green Lions is for siblings of students in the Yellow Group and their friends.)
Saturday

St. Colmcille's Primary School, Idrone Avenue, Knocklyon, D16
10:00-11:00 AM: BLUE
10:30-11:00 AM: TOTS* (*Can combine with Ballet)
11:15-11:45 AM: TOTS (Tots 1/2 hour class: €320 per year)
12:00-1:00 PM: BLUE, GREEN
12:30-1:30 PM: YELLOW
The Mill Theatre, Dundrum Town Centre, D14
10:30-11:30 AM: BLUE, GREEN
11:30-12:30 PM: GREEN, YELLOW
12:30-1:30 PM: YELLOW
Specialised Classes (Singing, Drama, and Ballet) – September 2024
Singing Lessons (€320 per year, max 4 per class)

Taney Parish Centre, Dundrum
Monday: 5:00-5:30 PM (2nd to 6th Class)
Monday: 6:30-7:00 PM (Secondary School)
Monday: 7:00-7:30 PM (Secondary School)
Sandyford Community Centre, Lamb's Cross
Wednesday: 5:15-5:45 PM (2nd to 6th Class)
St. Colmcille's Primary School, Knocklyon
Wednesday: 5:30-6:00 PM (Secondary School)
Wednesday: 6:00-6:30 PM (Secondary School)
Wednesday: 8:30-9:00 PM (Secondary School)
Friday: 4:45-5:15 PM (2nd to 6th Class)
Mill Theatre, Dundrum Town Centre
Saturday: 12:30-1:00 PM (2nd to 6th Class)
St. Colmcille's Primary School, Knocklyon
Saturday: 10:00-10:30 AM (2nd to 6th Class)
Saturday: 11:00-11:30 AM (Secondary School)
Saturday: 11:30 AM-12:00 PM (2nd to 6th Class)
Saturday: 1:00-1:30 PM (2nd to 6th Class)
Drama Exam Classes (€160 per term, max 4 per class)

Taney Parish Centre, Dundrum
Monday: 5:00-5:30 PM (Grade 3 upwards)
Monday: 5:30-6:00 PM (Grade 5 upwards)
St. Colmcille's Primary School, Knocklyon
Wednesday: 6:00-6:30 PM (Grade 5 upwards)
Friday: 3:45-4:15 PM (Grade 3 upwards)
Friday: 4:15-4:45 PM (Grade 5 upwards)
Friday: 4:45-5:15 PM (Grade 5 upwards)
Saturday: 12:00-12:30 PM (Grade 3 upwards)
Saturday: 1:00-1:30 PM (Grade 3 upwards)
Mill Theatre, Dundrum Town Centre
Thursday: 5:30-6:00 PM (Grade 3 upwards)
(Drama Exam classes available at various locations based on availability. Contact: encorekidsdublin@gmail.com)

Ballet Classes (€320 per year, beginners of all ages welcome)

St. Colmcille's Primary School, Knocklyon
Saturday: 10:00-10:20 AM (Ballet 1 for TOTS)
Ballet Classes (€320 per year, beginners of all ages welcome)

St. Colmcille's Primary School, Knocklyon
Saturday:
10:00-10:30 AM: Ballet 1 (TOTS) – Pre-school (age 3 and 4 years)
11:00-11:30 AM: Ballet 2 (JUNIOR) – Junior/Senior Infants/1st Class
11:30 AM-12:00 PM: Ballet 3 (INTER) – 2nd to 5th Class
1:00-2:00 PM: Ballet 4 (SENIOR) – 6th Class/Secondary School


Frequently Asked Questions (FAQs)
How do I contact someone at Encore?

Email: encorekidsdublin@gmail.com
Facebook: www.facebook.com/encorekids
Voicemail: Responses may take up to 3 days.
Urgent Queries: Contact Maddy or Lorna (centre supervisors) at any centre. They will ensure your message reaches the appropriate person immediately.
At Class: For any questions, wait until changeover time to speak with a teacher, as their priority is supervising the class.
What happens at class every week?

Each week includes:
30 minutes of Drama
30 minutes of Singing or Dancing
Workshops are held during each term for extra activities and fun.
How do I ensure my child gets the most out of Encore?

Attend classes on time every week.
Go over scripts, songs, and dances at home.
Practice ensures your child can perform confidently on stage. Scripts must be learned at home.
What do the group colours mean?

Encore's "Rainbow System" reflects student progression:

Purple: Tots; Pre-school
Blue: Junior/Senior Infants
Green: 1st-3rd Class
Yellow: 4th-6th Class
Red: 1st-6th Year
A student’s folder indicates their group colour. Knowing this is important for class organisation and communication!

Does every child perform in the end-of-year show?

Yes, all children in Ballet, Blue, Green, Yellow, Orange, and Red Groups perform in the Mill Theatre.
Purple (Tots) perform in a display at St. Colmcille’s School at the end of Term 2.
How do I know which show my child is in?

Details about theatre rehearsals and performances will be shared before the midterm break.
Check your child’s folder for updates.
How many rehearsals are in the Theatre?

All groups, including Ballet and Hip-Hop Groups, have a Theatre Rehearsal in The Mill Theatre.
When do I book tickets for the show?

Tickets will go on sale in March, and parents will be emailed the exact date.
How do I pay?

Preferred Method: Easy Payments Plus (via the "Enrol Here" button on Encore's website or directly at easypaymentsplus.com).
Other Options: Cash on the first day of class, cheque, or online transfer.
How do I know my child is progressing?

All students grow in confidence and skills throughout the year.
If progress is not observed, Encore will contact you directly via phone or email.
Specific concerns can be discussed with a teacher (after class time) or via email at encorekidsdublin@gmail.com.

SHOWS FAQ: 

SHOW INFORMATION SHEET FOR 2024

We have a few bits of important information in relation to final rehearsals and shows for everyone in Junior Infants to 6th year which we will outline here. There is a lot to take in, especially if this is your first Encore Show, so please do take a few minutes to read through each item carefully, we think we have answered all of the usual questions!

 Most important to note is that from Saturday 20th April at 2pm onwards there are no more regular classes.There are classes in usual centres on Saturday 20th April up to 2pm. Please do not go to your usual centre from Monday 22nd April onwards as no one will be there…we will all be in the theatre! 

Rehearsals in the theatre start on Sunday 21st April.

Also please note that shows with 2 groups performing are approximately 90 minutes long, and shows with 3 groups are 2 hours long, with a 15 minute interval. All students are fully supervised and entertained backstage by our fabulous staff. This will be a really fun experience, so while they are not on stage please be assured that they are having a wonderful time!

DROP OFF AND PICK UP FOR THEATRE REHEARSALS 
Please note we have a separate drop off and pick up point for rehearsals.

Drop off for the Theatre Rehearsals will be at STAGE DOOR at the back of  the Mill Theatre which is beside SMOOCH Dessert Parlor in the Pembroke District at Dundrum Town Centre. Our teachers will be there to meet the students. .We would ask people to be as punctual as possible so that we don’t waste any rehearsal time! 

Pick up of students from Theatre Rehearsal

All students can be picked up afterwards from the MAIN FRONT DOOR of the Mill Theatre (please wait outside and we will bring the children to the door). Students will be released in class groups as usual. Blue Group and Green Group students will only be released to a parent. Yellow Group students can meet a parent waiting for them at the door, or they are allowed to walk out to meet parents. Let us know if your Yellow Group student is NOT allowed to leave the theatre alone. EYT (secondary school) students will be free to leave on their own. 

On the day of rehearsals no folders are required. Students are asked to bring as little as possible into the auditorium (no food, just water if required, as rehearsals are short). All students should wear their Encore t-shirt to the theatre on days of rehearsals. Please bring your child to a bathroom before you arrive at the rehearsal, as it saves us so much precious time!

DROP OFF AND PICK UP FOR SHOWS: ONE HOUR BEFORE THE SHOW
Drop off of & Pick up of students for shows will take place on the basement level of the theatre, one hour before the show.  So you do come right inside the theatre and bring them down 2 flights of stairs yourself for the SHOW. Teachers will be in this area  to receive your children. At the end of shows we will release the students from the same door on the basement level (where the bar area is). If you send one representative from your family to this area to collect your child straight after the show, they will be let out 10 mins after the end of the show.

Please note, if your child is unwell on show day please do not bring them to the show. It can be a very bad experience for a child to feel unwell in a very busy place like backstage. Of course we want everyone to be at their show, but it is important that they are feeling well and can be on stage without the fear of being sick. We also operate in a very confined space and therefore need to keep all our staff and students health in mind. 

WHAT TO WEAR TO SHOWS: 
PLEASE LABEL ALL CLOTHING ITEMS THAT ARE WORN TO SHOWS! 

On Show Day all students should arrive one hour before the show. Please make sure your child arrives on time to allow them to be costumed and ready for the show. 

All those with long hair from Blue, Green and Yellow Groups should have two plaits in their hair with black bobbins if possible (we will replace them on the plaits in the theatre if you don’t have any, so no pressure). We will provide white tights for girls in Blue Groups. These will be distributed on rehearsal day, and should be worn by each child to their show. Boys in the Blue Groups will be given socks. 

All girls in Green Groups will be given tights at their theatre rehearsal and should arrive in these on the day of shows. Students from the Yellow Groups will be given socks and tights etc at the theatre on their show day. 

Footwear: All students in Blue, Green, Yellow and EYT Groups should wear black rubber soled canvas style shoes. Plimsolls are ideal, or any form of rubber soled black shoe, with or without laces etc. Black jazz shoes are also perfect, or Irish dancing pumps may be worn. 

Other Clothing: For Shows only (not rehearsals): All Blue and Green group students (Junior Infants to 3rd class) should wear a white sleeveless vest and a pair of white shorts if possible (we suggest old white leggings cut into a pair of shorts as an easy option). The vest and the shorts (made from cut off leggings) allow for easy changing in communal dressing rooms. If you don’t have white, a very light pastel colour would suffice, just so they do not show through light coloured costumes etc. They can wear their Encore t-shirt (labelled please!!) and some bottoms (shorts/leggings/tracksuit bottoms) over these for arrival to theatre on show day. We ask that each boy wear black or navy trousers/chinos to the theatre if possible. We have a large supply of these for use as costumes, but often their own trousers are more comfy and fit well. 

Yellow Group students (4th to 6th class) should wear a black vest top and shorts (again cut off leggings are ideal) or anything similar in black that they will feel comfortable changing in. These are for underneath their costumes only. If every boy in the Yellow group arrives in dark trousers, black or navy, we have a large supply of trousers for costumes but often their own pair fit much better. 

All other costume items will be provided by Encore! at the theatre. Please do not send any jewellery/bags/coats/folders etc with the children as they are so easily mislaid backstage. 

Finally, for all theatre rehearsals and shows a drink of water in a labelled plastic beaker may be brought if required. Please do not send snacks unless medically required.

 

VIDEO RECORDING:
As you know all video recording of shows is prohibited in The Mill Theatre according to theatre policy for child protection. We have arranged for a video recording of each show to take place which we can offer for the price of just €10 for a downloadable edited version of each show. We have added a payment option for this recording on the EPP. This recording must be downloaded within 2 weeks of receiving it in order to preserve it for you.

So although you cannot record the show yourself, you can have a record of this exciting moment for your star! Please do not try to record any of the shows yourself on phones or tablets, it is very distracting for the performers/other audience members, causes a lot of disruption as Mill staff have to ask you to stop, and it is against the child protection policy in The Mill Theatre.

 

PRE-ORDERED PROGRAMMES: 
Each year we put together the Encore! Programme with the list of all our performers in each show. These are for sale on the show day. As many people travel without cash these days we have set up a payment that can be selected on the easy payments system to allow parents to pre-order their programme for the show that their child  is in. That is available from today, if anyone would prefer to pre-order and just collect your programme on your show day you can do that now. The cost of the programme is the same as last year €5, which just covers the cost of printing. We will have our EYT students at a table in the foyer with the pre-ordered  programmes to be collected.  Programmes will also be for sale on show days.

INTERVAL DRINKS:
Finally, a message from the Mill Theatre, you can place your order for your interval drinks when you drop off your child at the stage door an hour before the show, in the basement area of the theatre, and they will be ready for you when the interval comes around. 



        💡 If you don't know the answer, **ask the user for more details** instead of guessing.
        Always keep responses **clear, friendly, and professional**.

        Start the conversation by greeting the user:  
        "Hello! I'm the Encore Stage School Assistant. How can I help you today?"
        `;

        // Make request to Mistral's API
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` // Secure API Key
            },
            body: JSON.stringify({
                model: "mistral-medium", // Free-tier model
                messages: [
                    { role: "system", content: systemInstructions }, // AI Agent's knowledge
                    { role: "user", content: message }
                ],
                max_tokens: 256
            })
        });

        const data = await response.json();
        console.log('Mistral AI response:', JSON.stringify(data, null, 2)); // Debugging

        // Ensure valid response
        if (!data.choices || data.choices.length === 0) {
            throw new Error('Invalid response from Mistral AI.');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.choices[0].message.content }) // Extract response
        };

    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Server error.' })
        };
    }
};

