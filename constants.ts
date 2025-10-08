import { User, Role, StaffRole, Chat, Announcement, ConsultationCategory, JobPosting } from './types';

export const MOCK_USERS: { [key: string]: User } = {
  student1: { id: 's1', name: 'Budi Santoso', email: 'budi.santoso@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126001', password: 'password123', avatarUrl: 'https://picsum.photos/seed/s1/100/100' },
  student2: { id: 's2', name: 'Citra Lestari', email: 'citra.lestari@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126002', password: 'password123', avatarUrl: 'https://picsum.photos/seed/s2/100/100' },
  student3: { id: 's3', name: 'Doni Firmansyah', email: 'doni.f@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126003', password: 'password123', avatarUrl: 'https://picsum.photos/seed/s3/100/100' },
  student4: { id: 's4', name: 'Rizky Pratama', email: 'rizky.p@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126004', password: 'password123', avatarUrl: 'https://picsum.photos/seed/s4/100/100' },
  lecturer1: { id: 'l1', name: 'Dr. Siti Aminah', email: 'siti.aminah@unsri.ac.id', role: Role.LECTURER, nim_nip: '198001012005012001', password: 'password123', avatarUrl: 'https://picsum.photos/seed/l1/100/100' },
  lecturer2: { id: 'l2', name: 'Prof. Budi Hartono', email: 'budi.hartono@unsri.ac.id', role: Role.LECTURER, nim_nip: '197505052000031001', password: 'password123', avatarUrl: 'https://picsum.photos/seed/l2/100/100' },
  staff1: { id: 'st1', name: 'Ahmad Fauzi', email: 'ahmad.fauzi@unsri.ac.id', role: Role.STAFF, staffRole: StaffRole.ACADEMIC, nim_nip: '199002022015031002', password: 'password123', avatarUrl: 'https://picsum.photos/seed/st1/100/100' },
  staff2: { id: 'st2', name: 'Rina Marlina', email: 'rina.marlina@unsri.ac.id', role: Role.STAFF, staffRole: StaffRole.STUDENT_AFFAIRS, nim_nip: '199203032018012003', password: 'password123', avatarUrl: 'https://picsum.photos/seed/st2/100/100' },
  alumni1: { id: 'a1', name: 'Eka Wijaya', email: 'eka.wijaya@alumni.unsri.ac.id', role: Role.ALUMNI, nim_nip: '09031281722001', password: 'password123', avatarUrl: 'https://picsum.photos/seed/a1/100/100', graduationYear: 2021 },
  alumni2: { id: 'a2', name: 'Fajar Nugraha', email: 'fajar.n@alumni.unsri.ac.id', role: Role.ALUMNI, nim_nip: '09031281722002', password: 'password123', avatarUrl: 'https://picsum.photos/seed/a2/100/100', graduationYear: 2021 },
  alumni3: { id: 'a3', name: 'Gita Permata', email: 'gita.p@alumni.unsri.ac.id', role: Role.ALUMNI, nim_nip: '09021181621003', password: 'password123', avatarUrl: 'https://picsum.photos/seed/a3/100/100', graduationYear: 2020 },
  serverAdmin: { id: 'sa1', name: 'Admin Server', email: 'admin@unsri.ac.id', role: Role.SERVER_ADMIN, nim_nip: 'ADMIN001', password: 'admin', avatarUrl: 'https://picsum.photos/seed/sa1/100/100' },
};

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    participants: [MOCK_USERS.student1, MOCK_USERS.lecturer1],
    topic: ConsultationCategory.ACADEMIC,
    type: 'private',
    messages: [
      { id: 'm1', senderId: 's1', text: 'Selamat pagi, Bu. Saya ingin bertanya mengenai jadwal KRS semester depan.', timestamp: '10:00 AM', read: true },
      { id: 'm2', senderId: 'l1', text: 'Selamat pagi, Budi. Tentu, jadwal KRS akan diumumkan minggu depan di portal akademik. Ada lagi yang bisa dibantu?', timestamp: '10:01 AM', read: true },
      { id: 'm3', senderId: 's1', text: 'Baik, Bu. Terima kasih banyak atas informasinya.', timestamp: '10:02 AM', read: false },
    ],
  },
  {
    id: 'chat2',
    participants: [MOCK_USERS.student1, MOCK_USERS.staff2],
    topic: ConsultationCategory.SCHOLARSHIP,
    type: 'private',
    messages: [
      { id: 'm4', senderId: 's1', text: 'Permisi, Pak/Bu. Saya ingin menanyakan informasi mengenai beasiswa PPA.', timestamp: '11:30 AM', read: true },
      { id: 'm5', senderId: 'st2', text: 'Halo. Pendaftaran Beasiswa PPA akan dibuka tanggal 1-15 bulan depan. Silakan siapkan berkas-berkasnya ya. Info lengkap ada di menu pengumuman.', timestamp: '11:32 AM', read: true },
    ],
  },
  {
    id: 'group1',
    name: 'Diskusi Tugas Akhir TI \'21',
    participants: [MOCK_USERS.student1, MOCK_USERS.student2, MOCK_USERS.student3],
    type: 'group',
    avatarUrl: 'https://picsum.photos/seed/group1/100/100',
    messages: [
        { id: 'gm1', senderId: 's2', text: 'Guys, ada referensi buat bab 2 ga? Aku agak buntu nih.', timestamp: '08:30 PM', read: true },
        { id: 'gm2', senderId: 's3', text: 'Coba cek di perpus online unsri, Cit. Kemarin aku nemu beberapa jurnal bagus di sana.', timestamp: '08:31 PM', read: true },
        { id: 'gm3', senderId: 's1', text: 'Betul, di IEEE Xplore juga banyak. Nanti aku share link-nya ya kalau ketemu.', timestamp: '08:32 PM', read: true },
        { id: 'gm4', senderId: 's2', text: 'Wah, makasih banyak yaa!! Sangat membantu.', timestamp: '08:33 PM', read: false },
    ]
  },
  {
    id: 'group_alumni_21',
    name: 'Alumni Teknik Informatika 2021',
    participants: [MOCK_USERS.alumni1, MOCK_USERS.alumni2],
    type: 'group',
    avatarUrl: 'https://picsum.photos/seed/alumni21/100/100',
    messages: [
        { id: 'am1', senderId: 'a1', text: 'Halo semua, apa kabar?', timestamp: 'Yesterday', read: true },
        { id: 'am2', senderId: 'a2', text: 'Baik, Ka! Lagi sibuk apa sekarang?', timestamp: 'Today', read: false },
    ]
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'a1', title: 'Jadwal Pengisian KRS Semester Ganjil 2024/2025', category: 'Jadwal Akademik', date: '20 Juli 2024', author: 'Bagian Akademik', content: 'Pengisian Kartu Rencana Studi (KRS) untuk semester ganjil akan dimulai pada tanggal 1 Agustus 2024 hingga 15 Agustus 2024. Pastikan untuk berkonsultasi dengan Dosen Pembimbing Akademik Anda.'},
    { id: 'a2', title: 'Pembukaan Pendaftaran Beasiswa Bank Indonesia 2024', category: 'Beasiswa', date: '18 Juli 2024', author: 'Bagian Kemahasiswaan', content: 'Telah dibuka pendaftaran Beasiswa Bank Indonesia bagi mahasiswa S1 semester 3-7. Batas akhir pendaftaran pada tanggal 30 Juli 2024. Syarat dan ketentuan dapat dilihat di website kemahasiswaan.'},
    { id: 'a3', title: 'Seminar Karir: "Membangun Personal Branding di Era Digital"', category: 'Karir & Alumni', date: '15 Juli 2024', author: 'Pusat Karir UNSRI', content: 'Ikuti seminar karir yang akan diadakan pada hari Sabtu, 27 Juli 2024 di Aula Fakultas Ekonomi. Pendaftaran gratis dan tempat terbatas! Terbuka untuk mahasiswa dan alumni.'},
];

export const CONSULTATION_SPECIALISTS: Record<ConsultationCategory, string[]> = {
    [ConsultationCategory.ACADEMIC]: ['l1', 'st1'], // Dr. Siti Aminah, Ahmad Fauzi
    [ConsultationCategory.CAREER]: ['l2'], // Prof. Budi Hartono
    [ConsultationCategory.SCHOLARSHIP]: ['st2'], // Rina Marlina
    [ConsultationCategory.STUDENT_AFFAIRS]: ['st2'], // Rina Marlina
    [ConsultationCategory.GENERAL]: ['l1', 'l2', 'st1', 'st2'],
};

export const MOCK_JOB_POSTINGS: JobPosting[] = [
    {
        id: 'job1',
        title: 'Frontend Developer (React)',
        company: 'PT. Teknologi Maju',
        location: 'Jakarta (Remote)',
        description: 'Mencari Frontend Developer berpengalaman dengan React.js untuk bergabung dengan tim inovatif kami. Pengalaman 2+ tahun diutamakan.',
        postedDate: '22 Juli 2024',
        contact: 'hrd@teknologimaju.com',
    },
    {
        id: 'job2',
        title: 'Data Analyst',
        company: 'Startup Analitika',
        location: 'Palembang',
        description: 'Dibutuhkan Data Analyst fresh graduate untuk mengolah dan menganalisis data. Menguasai SQL dan Python adalah nilai plus.',
        postedDate: '21 Juli 2024',
        contact: 'karir@startupanalitika.id',
    },
    {
        id: 'job3',
        title: 'Project Manager',
        company: 'BUMN Karya Sejahtera',
        location: 'Nasional',
        description: 'Program Management Trainee untuk posisi Project Manager. Terbuka untuk semua jurusan, IPK min 3.25.',
        postedDate: '20 Juli 2024',
        contact: 'rekrutmen@karyasejahtera.bumn.go.id',
    }
];