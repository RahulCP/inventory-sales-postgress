--
-- PostgreSQL database dump
--
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP SEQUENCE IF EXISTS items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS sales_id_seq CASCADE;

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Dumped from database version 14.12 (Homebrew)
-- Dumped by pg_dump version 16.3

-- Started on 2024-08-21 20:12:42 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 24597)
-- Name: items; Type: TABLE; Schema: public; Owner: illolam
--

CREATE TABLE public.items (
    code character varying(50),
    category character varying(50),
    sellingprice numeric,
    price numeric,
    quantity integer,
    image character varying(255),
    publish boolean,
    publishedurl character varying(50),
    boxno integer,
    systemdate timestamp with time zone,
    inventoryid bigint,
    id integer NOT NULL,
    purchasedate date
);


ALTER TABLE public.items OWNER TO illolam;

--
-- TOC entry 210 (class 1259 OID 24602)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: illolam
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO illolam;

--
-- TOC entry 3658 (class 0 OID 0)
-- Dependencies: 210
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: illolam
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- TOC entry 211 (class 1259 OID 24603)
-- Name: sales; Type: TABLE; Schema: public; Owner: illolam
--

CREATE TABLE public.sales (
    id bigint NOT NULL,
    items jsonb,
    sales_date date,
    price numeric(10,2),
    buyer_details text,
    phone_number character varying(15),
    sales_status character varying(2),
    system_date timestamp without time zone,
    give_away boolean,
    shipment_date date,
    shipment_price numeric(10,2),
    shipment_method character varying(10),
    tracking_id character varying(50),
    name character varying(255)
);


ALTER TABLE public.sales OWNER TO illolam;

--
-- TOC entry 212 (class 1259 OID 24608)
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: illolam
--

CREATE SEQUENCE public.sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_id_seq OWNER TO illolam;

--
-- TOC entry 3659 (class 0 OID 0)
-- Dependencies: 212
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: illolam
--

ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;


--
-- TOC entry 3503 (class 2604 OID 24609)
-- Name: items id; Type: DEFAULT; Schema: public; Owner: illolam
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- TOC entry 3504 (class 2604 OID 24610)
-- Name: sales id; Type: DEFAULT; Schema: public; Owner: illolam
--

ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);


--
-- TOC entry 3648 (class 0 OID 24597)
-- Dependencies: 209
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: illolam
--

COPY public.items (code, category, sellingprice, price, quantity, image, publish, publishedurl, boxno, systemdate, inventoryid, id, purchasedate) FROM stdin;
illolam_127	2	640	240	5	/images/illolam_127.jpg	f		8	2024-08-03 11:19:22.605+05:30	1722664162605	128	2024-08-03
illolam_85	5	700	430	4	/images/illolam_85.jpg	f		9	2024-08-03 10:49:10.58+05:30	1722662350580	86	2024-08-03
illolam_89	1	800	455	1	/images/illolam_89.jpg	f		9	2024-08-03 10:51:22.059+05:30	1722662482059	90	2024-08-03
illolam_91	1	540	220	4	/images/illolam_91.jpg	f		9	2024-08-03 10:52:24.861+05:30	1722662544861	92	2024-08-03
illolam_93	2	1300	850	6	/images/illolam_93.jpg	f		9	2024-08-03 10:55:07.586+05:30	1722662707586	94	2024-08-03
illolam_87	1	540	220	6	/images/illolam_87.jpg	f		9	\N	1722662394650	88	2024-08-03
illolam_9		612	220	7	/images/illolam_9.jpg	f		6	2024-08-02 15:29:14.89+05:30	1722592754890	10	2024-08-02
illolam_13	1	810	460	2	/images/illolam_13.jpg	t		6	2024-08-02 15:33:11.464+05:30	1722592991464	14	2024-08-02
illolam_18	2	865	545	6	/images/illolam_18.jpg	f		6	2024-08-02 15:35:18.828+05:30	1722593118828	19	2024-08-02
illolam_25	1	820	500	1	/images/illolam_25.jpg	f		4	2024-08-02 15:40:08.822+05:30	1722593408822	26	2024-08-02
illolam_27	3	685	365	2	/images/illolam_27.jpg	f		4	2024-08-02 15:41:28.225+05:30	1722593488225	28	2024-08-02
illolam_29	2	530	210	5	/images/illolam_29.jpg	f		4	2024-08-02 15:46:55.79+05:30	1722593815790	30	2024-08-02
illolam_32	3	810	490	6	/images/illolam_32.jpg	f		4	2024-08-02 15:49:26.048+05:30	1722593966048	33	2024-08-02
illolam_34		450	130	4	/images/illolam_34.jpg	f		4	2024-08-02 15:51:12.965+05:30	1722594072965	35	2024-08-02
illolam_36	3	1100	650	3	/images/illolam_36.jpg	f		4	2024-08-02 15:53:39.364+05:30	1722594219364	37	2024-08-02
illolam_38	3	1100	650	3	/images/illolam_38.jpg	f		4	2024-08-02 15:54:13.576+05:30	1722594253576	39	2024-08-02
illolam_20	2	605	285	5	/images/illolam_20.jpg	f		6	\N	1722593200448	21	2024-08-02
illolam_40	2	540	220	5	/images/illolam_40.jpg	f		10	2024-08-02 16:00:00.625+05:30	1722594600625	41	2024-08-02
illolam_42	3	820	505	6	/images/illolam_42.jpg	f		10	2024-08-02 16:01:30.465+05:30	1722594690465	43	2024-08-02
illolam_44		589	260	2	/images/illolam_44.jpg	f		10	2024-08-02 16:02:11.955+05:30	1722594731955	45	2024-08-02
illolam_50		770	450	1	/images/illolam_50.jpg	f		2	2024-08-02 16:05:46.381+05:30	1722594946381	51	2024-08-02
illolam_52		700	380	1	/images/illolam_52.jpg	f		2	2024-08-02 16:06:54.831+05:30	1722595014831	53	2024-08-02
illolam_54	2	1125	655	4	/images/illolam_54.jpg	f		2	2024-08-02 16:08:00.359+05:30	1722595080359	55	2024-08-02
illolam_56		540	220	4	/images/illolam_56.jpg	f		2	2024-08-02 16:09:29.61+05:30	1722595169610	57	2024-08-02
illolam_58	2	750	455	4	/images/illolam_58.jpg	f		2	2024-08-02 16:10:33.022+05:30	1722595233022	59	2024-08-02
illolam_60	3	640	320	4	/images/illolam_60.jpg	f		2	2024-08-02 16:11:42.641+05:30	1722595302641	61	2024-08-02
illolam_62	2	780	460	3	/images/illolam_62.jpg	f		1	2024-08-02 16:13:05.431+05:30	1722595385431	63	2024-08-02
illolam_64		870	550	4	/images/illolam_64.jpg	f		1	2024-08-02 16:15:04.265+05:30	1722595504265	65	2024-08-02
illolam_66	2	610	260	3	/images/illolam_66.jpg	f		1	2024-08-02 16:15:42.776+05:30	1722595542776	67	2024-08-02
illolam_68	2	920	520	3	/images/illolam_68.jpg	f		1	2024-08-02 16:16:52.01+05:30	1722595612010	69	2024-08-02
illolam_74		1200	640	3	/images/illolam_74.jpg	f		1	2024-08-02 16:21:20.385+05:30	1722595880385	75	2024-08-02
illolam_76	4	640	330	3	/images/illolam_76.jpg	f		1	2024-08-02 16:22:49.216+05:30	1722595969216	77	2024-08-02
illolam_78		1100	640	3	/images/illolam_78.jpg	f		1	2024-08-02 16:24:09.941+05:30	1722596049941	79	2024-08-02
illolam_70		750	440	5	/images/illolam_70.jpg	f		1	\N	1722595744862	71	2024-08-02
illolam_95	5	700	380	1	/images/illolam_95.jpg	f		9	2024-08-03 10:57:43.266+05:30	1722662863266	96	2024-08-03
illolam_97	2	825	\N	3	/images/illolam_97.jpg	f		11	2024-08-03 10:59:00.843+05:30	1722662940843	98	2024-08-03
illolam_101	1	810	460	2	/images/illolam_101.jpg	f		11	2024-08-03 11:00:37.921+05:30	1722663037921	102	2024-08-03
illolam_103	1	810	460	3	/images/illolam_103.jpg	f		11	2024-08-03 11:01:09.945+05:30	1722663069945	104	2024-08-03
illolam_105	1	810	460	1	/images/illolam_105.jpg	f		11	2024-08-03 11:01:56.39+05:30	1722663116390	106	2024-08-03
illolam_107	1	810	460	2	/images/illolam_107.jpg	f		11	2024-08-03 11:02:25.333+05:30	1722663145333	108	2024-08-03
illolam_109	1	810	460	1	/images/illolam_109.jpg	f		11	2024-08-03 11:03:02.086+05:30	1722663182086	110	2024-08-03
illolam_111	2	700	380	1	/images/illolam_111.jpg	f		12	2024-08-03 11:07:24.629+05:30	1722663444629	112	2024-08-03
illolam_113		700	380	3	/images/illolam_113.jpg	f		12	2024-08-03 11:09:32.475+05:30	1722663572475	114	2024-08-03
illolam_115		700	380	3	/images/illolam_115.jpg	f		12	2024-08-03 11:10:09.911+05:30	1722663609911	116	2024-08-03
illolam_117		700	380	6	/images/illolam_117.jpg	f		12	2024-08-03 11:12:15.922+05:30	1722663735922	118	2024-08-03
illolam_119	2	600	200	3	/images/illolam_119.jpg	f		12	\N	1722663815078	120	2024-08-03
illolam_121		700	380	3	/images/illolam_121.jpg	f		12	2024-08-03 11:14:52.532+05:30	1722663892532	122	2024-08-03
illolam_123	2	399	189	3	/images/illolam_123.jpg	f		12	2024-08-03 11:16:26.02+05:30	1722663986020	124	2024-08-03
illolam_131	2	700	380	3	/images/illolam_131.jpg	f		8	2024-08-03 11:22:25.685+05:30	1722664345685	132	2024-08-03
illolam_133		700	380	2	/images/illolam_133.jpg	f		8	2024-08-03 11:23:04.036+05:30	1722664384036	134	2024-08-03
illolam_135	2	540	220	4	/images/illolam_135.jpg	f		14	2024-08-03 11:25:29.484+05:30	1722664529484	136	2024-08-03
illolam_137	2	850	510	1	/images/illolam_137.jpg	f		14	2024-08-03 11:27:23.763+05:30	1722664643763	138	2024-08-03
illolam_139	2	810	510	2	/images/illolam_139.jpg	f		14	2024-08-03 11:27:51.412+05:30	1722664671412	140	2024-08-03
illolam_141	2	849	510	1	/images/illolam_141.jpg	f		14	2024-08-03 11:29:34.222+05:30	1722664774222	142	2024-08-03
illolam_143	2	850	530	1	/images/illolam_143.jpg	f		13	2024-08-03 11:31:06.269+05:30	1722664866269	144	2024-08-03
illolam_145	3	545	240	4	/images/illolam_145.jpg	f		13	2024-08-03 11:32:49.362+05:30	1722664969362	146	2024-08-03
illolam_147		870	530	4	/images/illolam_147.jpg	f		13	2024-08-03 11:34:02.404+05:30	1722665042404	148	2024-08-03
illolam_149		680	360	5	/images/illolam_149.jpg	f		13	2024-08-03 11:37:19.357+05:30	1722665239357	150	2024-08-03
illolam_48	2	899	570	6	/images/illolam_48.jpg	t		2	\N	1722594886127	49	2024-08-03
illolam_46		870	550	6	/images/illolam_46.jpg	f		10	\N	1722594791309	47	2024-08-03
illolam_22		849	530	3	/images/illolam_22.jpg	t		4	\N	1722593330167	23	2024-08-03
illolam_72		1200	640	3	/images/illolam_72.jpg	f		1	\N	1722595804646	73	2024-08-03
illolam_125	3	399	180	3	/images/illolam_125.jpg	f		12	\N	1722664016053	126	2024-08-03
illolam_99	2	825	380	2	/images/illolam_99.jpg	f		11	\N	1722662970833	100	2024-08-03
illolam_151	5	280	72	4	/images/illolam_151.jpg	f		13	2024-08-03 11:42:24.365+05:30	1722665544365	152	2024-08-03
illolam_153		620	300	4	/images/illolam_153.jpg	f		5	2024-08-03 11:45:05.993+05:30	1722665705993	154	2024-08-03
illolam_155	3	580	260	3	/images/illolam_155.jpg	f		5	2024-08-03 11:46:54.67+05:30	1722665814670	156	2024-08-03
illolam_157		399	130	6	/images/illolam_157.jpg	f		5	2024-08-03 11:48:43.572+05:30	1722665923572	158	2024-08-03
illolam_159		680	360	3	/images/illolam_159.jpg	f		5	2024-08-03 11:50:32.58+05:30	1722666032580	160	2024-08-03
illolam_161	2	680	360	5	/images/illolam_161.jpg	f		5	2024-08-03 11:53:44.762+05:30	1722666224762	162	2024-08-03
illolam_165	3	1150	648	3	/images/illolam_165.jpg	f		3	2024-08-03 12:00:43.914+05:30	1722666643914	166	2024-08-03
illolam_167	3	1150	648	3	/images/illolam_167.jpg	f		3	2024-08-03 12:01:23.604+05:30	1722666683604	168	2024-08-03
illolam_170	2	1150	648	3	/images/illolam_170.jpg	f		3	2024-08-03 12:01:56.025+05:30	1722666716025	171	2024-08-03
illolam_172	3	470	150	6	/images/illolam_172.jpg	f		5	2024-08-03 12:04:00.439+05:30	1722666840439	173	2024-08-03
illolam_178		620	200	6	/images/illolam_178.jpeg	f		15	2024-08-03 12:08:49.273+05:30	1722667129273	179	2024-08-03
illolam_180		510	190	10	/images/illolam_180.jpg	f		15	2024-08-03 12:10:46.134+05:30	1722667246134	181	2024-08-03
illolam_184	3	520	200	6	/images/illolam_184.jpg	f		15	2024-08-03 12:12:05.066+05:30	1722667325066	185	2024-08-03
illolam_174	3	500	162	10	/images/illolam_174.jpg	f		3	\N	1722667026472	175	2024-08-03
illolam_194	2	560	216	5	/images/illolam_194.jpg	f		16	2024-08-03 12:31:35.744+05:30	1722668495744	195	2024-08-03
illolam_198	3	500	162	6	/images/illolam_198.jpg	f		16	2024-08-03 12:33:33.976+05:30	1722668613976	199	2024-08-03
illolam_200		840	468	10	/images/illolam_200.jpg	f		16	2024-08-03 12:34:31.395+05:30	1722668671395	201	2024-08-03
illolam_202	2	470	135	5	/images/illolam_202.jpg	f		16	2024-08-03 12:35:48.905+05:30	1722668748905	203	2024-08-03
illolam_204	2	700	342	2	/images/illolam_204.jpg	f		17	2024-08-03 12:37:08.8+05:30	1722668828800	205	2024-08-03
illolam_206		800	396	3	/images/illolam_206.jpg	f		17	2024-08-03 12:38:49.465+05:30	1722668929465	207	2024-08-03
illolam_210		560	240	6	/images/illolam_210.jpg	f		18	\N	1722669041252	211	2024-08-03
illolam_212		900	580	4	/images/illolam_212.jpg	f		17	2024-08-03 12:41:41.49+05:30	1722669101490	213	2024-08-03
illolam_214		450	117	6	/images/illolam_214.jpg	f		17	2024-08-03 12:43:33.041+05:30	1722669213041	215	2024-08-03
illolam_216		900	522	6	/images/illolam_216.jpg	f		17	2024-08-03 12:44:29.265+05:30	1722669269265	217	2024-08-03
illolam_218		540	220	5	/images/illolam_218.jpg	f		18	2024-08-03 12:45:33.32+05:30	1722669333320	219	2024-08-03
illolam_220		510	190	6	/images/illolam_220.jpg	f		18	2024-08-03 12:47:14.285+05:30	1722669434285	221	2024-08-03
illolam_222		1290	615	6	/images/illolam_222.jpg	f		2	2024-08-03 12:50:58.372+05:30	1722669658372	223	2024-08-03
illolam_129	2	810	490	4	/images/illolam_129.jpg	t		8	\N	1722664276758	130	2024-08-03
illolam_182	3	540	220	6	/images/illolam_182.jpg	f		15	\N	1722667292353	183	2024-08-03
illolam_231	2	15584	8112	1	/images/illolam_231.png	f		1111	\N	1722681470691	232	2024-08-03
illolam_226	1	120953	65923	1	/images/illolam_226.jpg	f		11111	\N	1722681248402	227	2024-08-03
illolam_224	2	750	445	3	/images/illolam_224.jpg	f		4	\N	1722669916919	225	2024-08-03
illolam_235		680	288	18	/images/illolam_235.jpeg	t		19	\N	1722839846140	236	2024-08-05
illolam_208		800	396	3	/images/illolam_208.jpg	f		17	\N	1722668955831	209	2024-08-07
illolam_196		580	234	6	/images/illolam_196.jpg	f		16	\N	1722668570120	197	2024-08-07
illolam_237	4	399	72	12	/images/illolam_237.jpeg	f		20	2024-08-09 19:23:37.238+05:30	1723211617238	238	2024-08-09
illolam_190		1320	738	10	/images/illolam_190.jpg	f		7	\N	1722668038531	191	2024-08-12
illolam_188		860	486	20	/images/illolam_188.jpg	f		7	\N	1722667912927	189	2024-08-12
illolam_186		650	216	10	/images/illolam_186.jpg	f		7	\N	1722667543366	187	2024-08-12
illolam_245		880	240	6	/images/illolam_245.jpeg	t		20	2024-08-21 16:42:15.187+05:30	1724238735187	246	2024-08-21
\.


--
-- TOC entry 3650 (class 0 OID 24603)
-- Dependencies: 211
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: illolam
--

COPY public.sales (id, items, sales_date, price, buyer_details, phone_number, sales_status, system_date, give_away, shipment_date, shipment_price, shipment_method, tracking_id, name) FROM stdin;
42	{"1722681248402": [1, "120953", 0]}	2024-08-03	120953.00	hghsdgsdhs	454545454	SD	2024-08-03 00:00:00	f	2024-08-03	400.00			Back Date
43	{"1722681470691": [1, "15584", 0]}	2024-08-03	15584.00	eerere	4545454	SD	2024-08-03 00:00:00	f	2024-08-03	0.00			Back Date
33	{"1722668495744": [1, "560", 0]}	2024-08-03	560.00	GMS consultant Pvt ltd\n2nd floor,Monlash Business center\nCrescens Tower,Kalmassery\nCochin : 682033	9633282737	SD	2024-08-03 00:00:00	f	2024-08-05	41.00			Sonia Thomas
34	{"1722668495744": [1, "560", 0]}	2024-08-03	560.00	flat no 11 b,\n jgt samruthi,\n kadavanthara, \ncochin - 682020	9961086999	SD	2024-08-03 00:00:00	f	2024-08-05	41.00			Dhanya anna mammen
35	{"1722668828800": [1, "700", 0]}	2024-08-03	700.00	Copperhills Apartment \nTower A \nKollamkudimughal \nThrikkakara \n682021\n	9048689999	SD	2024-08-03 00:00:00	f	2024-08-05	59.00			Leviya Vijayan 
36	{"1722663986020": [1, "399", 0], "1722668495744": [1, "560", 0]}	2024-08-03	959.00	Alakapuri ,\nT P Puram ,\nVazhoor,\nKottayam, Kerala\nPin 686504\n	9447464386	SD	2024-08-03 00:00:00	f	2024-08-05	41.00			P R Ramachandran Nair
38	{"1722667292353": [1, "540", 0]}	2024-08-03	540.00	W/O Varghese  P F\nPadayattil  house\nWest Gosayikunnu\nKuriachira\nHouse no:21 A\nPin - 680006	8075468935	SD	2024-08-03 00:00:00	f	2024-08-05	47.00			Maria Simonn
39	{"1722663815078": [1, "600", 0]}	2024-08-03	600.00	Ambanappillil  (h)\nayavana po \nKarimattam \nPin 686668\nMuvattupuzha \nErnakulam	9633886338	SD	2024-08-03 00:00:00	f	2024-08-05	41.00			Eldho paulose 
40	{"1722592754890": [1, "612", 15], "1722664969362": [1, "545", 0], "1722669101490": [1, "900", 15]}	2024-08-03	1830.20	House no 65\nV and V penta \nP kesavdev Dev road \nMudavanmughal Poojappura p.o \nPin 695012\n	6238060792	SD	2024-08-03 00:00:00	f	2024-08-05	35.00			Devi M Nair
41	{"1722668495744": [1, "560", 15], "1722668748905": [1, "470", 15]}	2024-08-03	876.00	HSST Computer Application \nSt.Marys HSS Niranam \nNiranam P O \nTiruvalla 689621\n	9400671150	SD	2024-08-03 00:00:00	f	2024-08-05	41.00			Radhika S
37	{"1722595804646": [1, "1200", 20], "1722662970833": [1, "850", 20], "1722664016053": [1, "399", 20], "1722667292353": [1, "540", 20], "1722669916919": [1, "750", 20]}	2024-08-03	2991.20	C/o Mr. Gopalakrishna Pillai, \nTC 13/1666-1,\nKannampallil House, \n, Medical College PO, \nThiruvananthapuram 695011	7012856072	SD	2024-08-03 00:00:00	f	2024-08-05	35.00			Nisha J U Nair
49	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	Gan Eden, Mullassery Lane, ymr junction, nanthenode, Kowdiar p o, pin  695003	9447047434	SD	2024-08-05 00:00:00	f	2024-08-06	30.00			Kichu Vijayan
46	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	Kripa\nMalayamadom\nKilimanoor(po )\nTvm\nPin.695601\n	9745515411	SD	2024-08-05 00:00:00	f	2024-08-06	41.00			Smitha.R
47	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	Door no-18/458\nRangaiahgari street\nNear kovuru garage\nProddatur\nKadapa dist \n516360 pin\nAndhra Pradesh	9701273522	SD	2024-08-05 00:00:00	f	2024-08-06	47.00			Renya Rangeesh
44	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	Rohinivilla \nAvadukka po\nPeruvannamuzhi via\nCalicut 673528\n	8943525787	SD	2024-08-05 00:00:00	f	2024-08-06	47.00			Remya vishnu
45	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	Kallumadathil house, Edavanakkad P O, Aniyal bazar, Ernakulam\n682502\n	9744788100	SD	2024-08-05 00:00:00	f	2024-08-06	41.00			Anu T R
48	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	Agna salon\n1 st floor, Engoor building,oppst Cathedral, irinjalakuda, Thrissur 680121	8138951285	SD	2024-08-05 00:00:00	f	2024-08-06	47.00			Vindhuja
51	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	AR Enterprise, Nadikavu junction, chathencode (p.o) kk district, Tamil Nadu \nPin no:629153	9345014782	SD	2024-08-05 00:00:00	f	2024-08-06	41.00			Abisha R
50	{"1722839846140": [1, "680", 0]}	2024-08-05	680.00	Mutturuthil house, chedana junction, Mamangalam, palarivattom p.o, \nErnakulam\nKerala - 682025	9809392006	SD	2024-08-05 00:00:00	f	2024-08-06	50.00			Suma mol 
61	{"1722839846140": [1, "680", 0]}	2024-08-07	680.00	SKRA B -20\nPattathil Veedu\n Sreekaryam, Sreekaryam \n P O - Thiruvananthapuram, Kerala 	7356898314	SD	2024-08-07 00:00:00	f	2024-08-08	30.00			Anjana 
60	{"1722595612010": [1, "920", 0]}	2024-08-06	920.00	62,3rd floor\n1st Main Road, Vinayak Nagar, Kattigenahalli\nBengaluru, KARNATAKA 560063\nIndia\n	8762129932	SD	2024-08-06 00:00:00	f	2024-08-08	47.00			Karthika 
53	{"1722593815790": [1, 610, 0]}	2024-08-06	610.00	Priyanka sasi \nSarovaram Malayidamthuruth po  \nMakkinikara \nPin 683561\n	8089210205	SD	2024-08-06 00:00:00	f	2024-08-08	47.00			Priyanka Sasi 
59	{"1722664774222": [1, "849", 15], "1722667292353": [1, "540", 15]}	2024-08-06	1180.65	Sivashylam \nPramadom \nMallassery P O \nPathanamthitta \n689646, \n9495205048	8547179344	SD	2024-08-06 00:00:00	f	2024-08-08	41.00			Shilpa sadasivan
57	{"1722594886127": [1, "899", 0]}	2024-08-06	899.00	Chalil house,house numbr:256 A\nAnjangadi\nP.o.kadappuram\nPin:680514\nThrissur district\nKerala\n	7560935757	SD	2024-08-06 00:00:00	f	2024-08-08	47.00			sameena abdulazees
54	{"1722595233022": [1, "750", 15], "1722839846140": [1, "680", 15]}	2024-08-06	1215.50	varakukalayil ( h)    \npoovarani  p  o     \nvilakkumadom \nPin 686577\nKottayam district \n+91 7510252153	7907067975	SD	2024-08-06 00:00:00	f	2024-08-08	41.00			Ajithkumar  v g  
58	{"1722839846140": [1, "680", 0]}	2024-08-06	680.00	Unniyanjiliveliyil  Pallippuram p.o Cherthala , Alappuzha .\nPIN 688541\nLan mark - Near Kalathil temple \n	9633643403	SD	2024-08-06 00:00:00	f	2024-08-08	41.00			Arya Rajendran 
52	{"1722667129273": [1, "620", 0]}	2024-08-06	620.00	Vivek Nivas 12/529\n Vadakkamuri op kannadi \nPin 678701\nPalakkad	9562285999	SD	2024-08-06 00:00:00	f	2024-08-08	80.00			Jaleela 
62	{"1722839846140": [1, "680", 0]}	2024-08-07	680.00	E6 jewel planet \nSh 15 tripunithura road\nNear mobility hub exit \nVyttila kochi 682019\nKerala	8108440786	SD	2024-08-07 00:00:00	f	2024-08-08	41.00			Rama Nair 
55	{"1722839846140": [1, "680", 0]}	2024-08-06	680.00	\nErumbumkandathil house\nKarukadom P O\nKothamangalam \nErnakulam\nKerala\nPin:686691	9400076781	SD	2024-08-06 00:00:00	f	2024-08-08	41.00			E K Subash
56	{"1722662350580": [1, "700", 15], "1722664276758": [1, "810", 15], "1722839846140": [1, "680", 0]}	2024-08-06	1963.50	Sreeja bhavan venchavode sreekariyam p o , 695017,cvra-75	9562921568	SD	2024-08-06 00:00:00	f	2024-08-08	80.00			Gowri
68	{"1722667543366": [1, 650, 0]}	2024-08-08	650.00	Karimbanakkal house\nVennakkode ,Alumthara\nNeeleswaram (po)\n omassery(via)\nPin 673582	9048635373	SD	2024-08-08 00:00:00	f	2024-08-09	47.00			Jibi saju 
64	{"1722668570120": [1, "580", 0], "1722668955831": [1, "800", 0]}	2024-08-07	1380.00	Puthiyaveettil House\nPunnakkabazar \nPO Mathilakam\nThrissur \n680685\n	919544783311	SD	2024-08-08 00:00:00	f	2024-08-08	71.00			suhad nazir
65	{"1722839846140": [1, "680", 0]}	2024-08-07	680.00	Shine city H wing flat no 505 pingale chowk near imperial hospital sonewane wasti chikhali pune maharashtra 411062	8999364782	SD	2024-08-07 00:00:00	f	2024-08-08	71.00			Akshaya Panickar 
63	{"1722667246134": [1, "510", 0]}	2024-08-07	510.00	Vindavanam, HLC Aspire Square, Mani sir road, Njarallor, Kizhakkambalam, Cochin - 683562	8861127107	SD	2024-08-07 00:00:00	f	2024-08-08	47.00			Reshmi Ratheesh
67	{"1722667543366": [1, 650, 0]}	2024-08-08	650.00	ASAP Kerala ,inside Kinfra Film and Video Park\nSainik School P.O, Chanthavila,\nPALLIPPURAM THIRUVANANTHAPURAM DISTRICT, KERALA 695585	9495999728	SD	2024-08-08 00:00:00	f	2024-08-09	41.00			Swathi Ajay
69	{"1722664671412": [1, "810", 15], "1722667292353": [1, "540", 15]}	2024-08-08	1182.00	XI/262 A, Choorakal House,\nOpp royal Garden Lane,\nMLA Road,Puthiyakavu,\nThripunithira,\nErnakulam 682307	8075594764	SD	2024-08-08 00:00:00	f	2024-08-09	41.00			Beena Subin
75	{"1722839846140": [1, "680", 0]}	2024-08-09	680.00	Sreenandanam House No 977,\nKunnathuchira Canal Road Ramakrishna Nagar\nThuthiyoor\nVazhakkala 682037, Kerala\n\nLandmark: Behind Vyapara Bhavan Annexe	9446688118	SD	2024-08-09 00:00:00	f	2024-08-09	41.00			Nitish Nandanan,
74	{"1722667543366": [1, "560", 20], "1722669916919": [1, "750", 20], "1722839846140": [1, "680", 20]}	2024-08-08	1592.00	Divyajai’s,45,first street, \nSwarnapuri highland extension,15 Velampalayam,Tirupur,pin:641652\nTamilnadu,	9600512482	SD	2024-08-09 00:00:00	f	2024-08-09	71.00			Divya Jai 
71	{"1722665042404": [1, "870", 0]}	2024-08-08	870.00	parayilpyrayidam,\nmundakkayam po,\nchelikuzhi,kottayam 686513	9745121011	SD	2024-08-09 00:00:00	f	2024-08-09	41.00			Aswathi Akhil
66	{"1722667325066": [1, "520", 0]}	2024-08-08	520.00	No. 106, gagan paradise, kodathi gate, sarjapura main road, bangalore - 560035	7338571441	SD	2024-08-08 00:00:00	f	2024-08-09	47.00			Athira Valsan
70	{"1722667543366": [1, 650, 0]}	2024-08-08	650.00	flat no:3b, silver castle bliss,akg nagar,\nperoorkada,tvm,695005	9995006713	SD	2024-08-12 00:00:00	f	2024-08-07	30.00			seema sutesh
72	{"1722664643763": [1, "850", 15], "1722839846140": [1, "680", 15]}	2024-08-08	1300.50	Aven house,Thekkepuram\nAnjoor road,Kunnamkulam po\nthrissur 680503	9061172678	SD	2024-08-08 00:00:00	f	2024-08-09	47.00			Divya AR
73	{"1722667543366": [1, "560", 0]}	2024-08-08	560.00	No. 60, Anu Palace Apartments\nFlat 201, 1st block, BEL LAYOUT,\nOpposite Axis bank,\nVidyaranyapura \nBangalore 560097	9972182271	SD	2024-08-08 00:00:00	f	2024-08-09	47.00			Bindu Divakara
82	{"1722666643914": [1, 1220, 15]}	2024-08-09	1040.00	Sarovaram , makkinikkara\n683561	8089210205	SD	2024-08-10 00:00:00	f	2024-08-10	47.00			Priyanka sasi
76	{"1722593488225": [1, "685", 0]}	2024-08-09	685.00	 ( h) house no 72\nEmc road Vennala p.o\nErnakulam Kerala 682028\nIndia\nMob. 	8138831571	SD	2024-08-09 00:00:00	f	2024-08-10	41.00			Nisha Dr M P . Unnikrishnan Nair 
77	{"1722667543366": [1, "560", 0]}	2024-08-09	560.00	SB Bhavan , Nadukani\nkattaykode po, kattakada\n695572	6238770630	SD	2024-08-09 00:00:00	f	2024-08-10	41.00			jisha raj
78	{"1722595014831": [1, "700", 0]}	2024-08-09	700.00	Subin bhavan\nmanjakla po\n691508\nparankimamukal\nkollam 	9207100159	SD	2024-08-09 00:00:00	f	2024-08-10	41.00			subi sebastian
79	{"1722667543366": [1, "560", 0]}	2024-08-09	560.00	Flat No.30, DDA LIG FLATS,Pocket 13, Palam,\nMangalapuri, Dwaraka,South west Delhi, New Delhi -110045	7982774199	SD	2024-08-09 00:00:00	f	2024-08-10	83.00			neethu mohan
80	{"1722668748905": [1, "470", 0], "1723211617238": [1, "399", 0]}	2024-08-09	869.00	1405, Flat no 402,13th main,\n9th cross, BTM 2nd stage, bangalore\n560076	8310324767	SD	2024-08-09 00:00:00	f	2024-08-10	47.00			Nazareen Farook
81	{"1722667129273": [1, "620", 15], "1722667543366": [1, "560", 15]}	2024-08-09	1003.00	Valiya Valappil house, P.O Kandoth,\nVia Payyanur\nKannur\n670307	8157802605	SD	2024-08-09 00:00:00	f	2024-08-10	47.00			Vipin Janardhanan
87	{"1722667543366": [1, 650, 0]}	2024-08-11	650.00	T9 F3,Mana Tropicale aprtmnt,\nChikkanayakanahalli,\nOff sarjapur road,\nCarmelaram,\nBangalore\n560035	8157042328	SD	2024-08-11 00:00:00	f	2024-08-12	47.00			Aathira Harikrishnan
86	{"1722666716025": [1, 1220, 15]}	2024-08-10	1040.00	AR Enterprise, Nadakavu junction\nChathencode (p.o) kk district\nTamilnadu , pincode 629153	9345014782	SD	2024-08-10 00:00:00	f	2024-08-12	41.00			Abisha
88	{"1722593408822": [1, "820", 0]}	2024-08-11	820.00	vipanchika,\nopp chinmaya vishwavidysapeet,\nwarriam road,\ncochin -682016\n\n	8281337441	SD	2024-08-11 00:00:00	f	2024-08-12	41.00			unnimaya s menon
85	{"1722595385431": [1, "780", 0]}	2024-08-10	780.00	Erezhath\nPuthenvelikkara PO\nN.Paravur\nErnakulam\n683594	9400801764	SD	2024-08-10 00:00:00	f	2024-08-12	47.00			Karthika TA
83	{"1722596049941": [1, 1100, 15]}	2024-08-10	940.00	Karuppamveetil house \nPO karayamtom muriyamthode Thriprayar\n680567	8921926084	SD	2024-08-10 00:00:00	f	2024-08-12	41.00			Shaniba Aneesh
84	{"1722593488225": [1, "685", 0]}	2024-08-10	685.00	SCRA 80, Aswathy ,\nNear mannadi bhagavathy temple\npallithanan, karamana po\n695002\n	9809354083	SD	2024-08-10 00:00:00	f	2024-08-12	30.00			Shilpa Sivan KS
89	{"1722594690465": [1, "820", 0]}	2024-08-11	820.00	\nSurabhi \nNear Bhagavathinada post office \nArapuranada Nagar temple road \nBhagavathinada PO\n695501\nThiruvananthapuram	8129730011	SD	2024-08-11 00:00:00	f	2024-08-12	41.00			Divya Gouthaman G
100	{"1722668495744": [1, "560", 0]}	2024-08-13	560.00	Kuruppathukattil house, \nKombara South,\nPopular Maruthi , Thrissur\n680121	8113007959	SD	2024-08-13 00:00:00	f	2024-08-14	47.00			Reshma
103	{"1722667912927": [1, "860", 0]}	2024-08-13	860.00	Intern pg Girls hostel\nMalabar Medical collg hospital\nand research centre\nAtholi , ulliyeri\nkozhikode , 673323	7306872815	SD	2024-08-13 00:00:00	f	2024-08-14	47.00			Sarangi CV
101	{"1722662350580": [1, "700", 0]}	2024-08-13	750.00	Aven House,Thekkepuram\nAnjoor road\nKunnamkulam PO\nThrissur\n680503	9061172678	SD	2024-08-13 00:00:00	f	2024-08-14	47.00			Divya AR
91	{"1722594886127": [1, "899", 20], "1722664969362": [1, "545", 20], "1722668038531": [1, 1320, 20]}	2024-08-11	2211.20	Santhivihar\nNoornad po, Near CBM HSS\nAlappuzha dist\n690504\n8606052591\n9495310008	9387040025	SD	2024-08-14 00:00:00	f	2024-08-14	59.00			Dhanya Arun
92	{"1722595302641": [1, "640", 0]}	2024-08-12	640.00	jan paruaushadhi kuttichal\ngovt lps paruthipalli school\ntyvm 695574	9562376626	SD	2024-08-12 00:00:00	f	2024-08-13	41.00			Remya kurup R
95	{"1722664671412": [1, "810", 0]}	2024-08-12	810.00	Tc 24/1300\nRes No 142\nSaji Nivas\nH Lane\nPipeline Lane Road\nSree Chitra Nagar\nKowdiar \n695003	8590885250	SD	2024-08-12 00:00:00	f	2024-08-13	30.00			Neethu Rajan U
99	{"1722667543366": [1, "560", 0]}	2024-08-12	650.00	\nChiraparambil (H) \nVeroor po. Changanacherry, Kottayam (686104)\n	91 88481 06897	SD	2024-08-12 00:00:00	f	2024-08-13	41.00			Serinsali
93	{"1722666840439": [1, "470", 15], "1722667129273": [1, "620", 15]}	2024-08-12	990.00	Nediyavila Veedu\nPatla ,Vanchiyoor post\nAttingal . tvm 695102	9544942738	SD	2024-08-12 00:00:00	f	2024-08-13	41.00			Geetha Vijay
96	{"1722669333320": [1, "540", 0]}	2024-08-12	540.00	Bhagavthi vilsomthu veeduANE-23 ulloor pongummoodu medical college po 695011 Thiruvananthapuram	8848950175	SD	2024-08-12 00:00:00	f	2024-08-13	30.00			Reshma Prakash 
97	{"1722667912927": [1, "850", 0]}	2024-08-12	860.00	TC 11/288, B line , B15 , near Christ Nagar School, keston road , kowdiyar po tvpm, 695003	8921428678	SD	2024-08-12 00:00:00	f	2024-08-13	30.00			Gopika 
98	{"1722667912927": [1, "850", 0]}	2024-08-12	860.00	W/O GIREESH CHITHRANJALI \nMANKETTINKARA HOUSE\nBEYPORE P O\nKOZHIKODE DISTRICT\nKERALA\n673015	8606582673	SD	2024-08-12 00:00:00	f	2024-08-13	47.00			SREELAKSHMI RAMACHANDRAN 
106	{"1722667912927": [1, 900, 0]}	2024-08-14	900.00	Flat 301, dhanalakshmi nilayam apartment,central bank lane,kalyan nagar phase1,hyderabad 500045	9744837009	SD	2024-08-14 00:00:00	f	2024-08-14	71.00			Najma.n
102	{"1722668038531": [1, "1320", 0]}	2024-08-13	1320.00	Flat no 309 , Neo EliteApartments\n93/4 ,Bettadasanapura Main Rd,\nCelebrity Paradise Layout\nDoddathoguru\nElectronic City Phase 1\nBengaluru. 560100	8861655565	SD	2024-08-13 00:00:00	f	2024-08-14	47.00			Prathusha Mathew
104	{"1722668038531": [1, "1320", 0]}	2024-08-13	1320.00	Thyparambil,\nBehind Sub Register Office\nKottiyam\nKollam\n691571	8281585732	SD	2024-08-13 00:00:00	f	2024-08-14	41.00			Adv Achu Joseph
105	{"1722595542776": [1, "610", 0]}	2024-08-13	610.00	Flat No 407\nMN Guru Akshita\nTirumanahalli Road\nAgrahara Layout\nYelahanka\nBangalore\n560064	9496493758	SD	2024-08-13 00:00:00	f	2024-08-14	47.00			Merin T Saji
108	{"1722668038531": [1, "1320", 0]}	2024-08-14	1320.00	Keralatrade, punnakulam road, Ksfe building uchakkada pin 695505\n	6282307492	SD	2024-08-14 00:00:00	f	2024-08-14	41.00			Kavya VP
119	{"1722667026472": [1, 580, 0]}	2024-08-16	580.00	Mummu,KRWA 18H,TC NO 39/1914(1),KATTACHAL ROAD,PAMBA LANE,VETTAMUKKU,VATTIYOORKAVU P O,PINCODE -695013,THIRUVANANTHAPURAM	8089138287	SD	2024-08-16 00:00:00	f	2024-08-16	30.00			Lekshmy A L
118	{"1722668613976": [1, "500", 0]}	2024-08-16	500.00	 Bangles beauty parlour and spa \nChenti , Pongummoodu \nMedical college PO \nTrivandrum 695011 	9778157995	SD	2024-08-16 00:00:00	f	2024-08-16	30.00			 Asha Santhosh
110	{"1722595542776": [1, "610", 15], "1722664016053": [1, "399", 15]}	2024-08-14	858.00	Adheena nivas\nKera 88 KERA gardens \nVallakkadavu po 695008\nEnchakkal, Trivandrum	9633642404	SD	2024-08-14 00:00:00	f	2024-08-16	30.00			Adharsa sivan 
113	{"1722667246134": [1, "510", 0]}	2024-08-14	510.00	Flat B6 \nHari Apartments \nAam Bagh \nGali no 2\nNear Gayatri villa \nRishikesh\nUttarakhand -249203\n7306365315	8547325383	SD	2024-08-14 00:00:00	f	2024-08-16	83.00			Dr.Anija A
111	{"1722667026472": [1, 580, 0]}	2024-08-14	580.00	Akka Mahadevi Hostel for Women\nThe English and Foreign Languages University \nHyderabad \n500007	9400680984	SD	2024-08-14 00:00:00	f	2024-08-16	71.00			Keerthi Moses
112	{"1722667026472": [1, 580, 0]}	2024-08-14	630.00	202, Lorven Residency\nOpposite Kedar Residency\nBachupally, Hyderabad, Telangana 500090\n	7022769491	SD	2024-08-14 00:00:00	f	2024-08-16	71.00			Athira Vinod
109	{"1722667912927": [1, "860", 0]}	2024-08-14	860.00	Skylark \nPKRA-212\nRakshapuri Lane\nKesavadasapuram \nPattom \nPo 695004\nThiruvananthapuram\n	9495232259	SD	2024-08-14 00:00:00	f	2024-08-16	30.00			Sushmitha 
117	{"1722594253576": [1, "1100", 20], "1722667026472": [1, "500", 20], "1722668613976": [1, "500", 20], "1722668748905": [1, "470", 20]}	2024-08-15	2056.00	Padinjare kottarathil \nCheriyanadu P. O \nChengannur\nPin : 689511	9074247911	SD	2024-08-15 00:00:00	f	2024-08-16	41.00			Padma Krishna 
116	{"1722667912927": [1, "860", 0]}	2024-08-15	860.00	Pootharakaleekkal malayil\nKodukulanji po chengannur \nPin 689508	9961184630	SD	2024-08-15 00:00:00	f	2024-08-16	41.00			Akhila Anil
114	{"1722668613976": [1, "500", 0], "1722668748905": [1, "470", 0]}	2024-08-15	970.00	\nValiyaparambil House\nMala Pallipuram P.O\nPlavinmury\nPin 680732\nThrissur district \nPh:	8086206251	SD	2024-08-15 00:00:00	f	2024-08-16	47.00			Minu Jithu 
120	{"1722669213041": [1, "450", 0]}	2024-08-16	630.00	Anil bhavanam\nVenga po\nSasthamcotta kollam\nPin 690521	9207084842	SD	2024-08-16 00:00:00	f	2024-08-19	80.00			Arya anil
115	{"1722669041252": [1, "560", 0]}	2024-08-15	650.00	Priyanka Pibin\nAricatt house\nAloor p.o\nPin.680683\nMala vazhi\nThrissur district	9605385306	SD	2024-08-15 00:00:00	f	2024-08-16	70.00			Priyanka Pibin
121	{"1722666840439": [1, "470", 0]}	2024-08-18	470.00	Kanjirmapa 	1111111111	SD	2024-08-18 00:00:00	f	2024-08-19	0.00			Chinnu
122	{"1722595169610": [1, "540", 0]}	2024-08-18	540.00	\nMoolamkuzhyil house\nNellimattom p.o Kavalangadu\nKothamangalam\n686693	8281160647	SD	2024-08-18 00:00:00	f	2024-08-19	41.00			Divya Issac
123	{"1722667912927": [1, "860", 0]}	2024-08-18	860.00	\nmakkoram veettil(H)\nTheyyangad ponnani(po)\nMalappuram \npin 679577\n	7902880045	SD	2024-08-18 00:00:00	f	2024-08-19	47.00			Nimitha MV
125	{"1722662970833": [1, "825", 0]}	2024-08-19	0.00	Kummal Kuniyil (ho)\nMadappally College (PO)\nVatakara\nKozhikode\nPin: 673102	9496342154	SD	2024-08-19 00:00:00	t	2024-08-19	47.00			Lekhilesh K K
124	{"1722667912927": [1, "860", 0]}	2024-08-18	860.00	\nMelethumalil\nVazhavara po vazhavara\n655515\nKattappana \nIdukki	8078812910	SD	2024-08-18 00:00:00	f	2024-08-21	41.00			Surya Sugathan
127	{"1723211617238": [1, "399", 0]}	2024-08-19	350.00	No. 60, Anu Palace Apartments\nFlat 201, 1st block, BEL LAYOUT,\nOpposite Axis bank,\nVidyaranyapura \nBangalore 560097	7306228716	SD	2024-08-19 00:00:00	f	2024-08-21	47.00			Bindu Divakara
130	{"1722669434285": [1, "510", 0]}	2024-08-21	510.00	47/1061,ayacs no-511,pournami, mv road, po civilstation, calicut-20,pin-673020	8593959125	SD	2024-08-21 00:00:00	f	2024-08-21	47.00			Sinistanley. C,
132	{"1722666840439": [1, "470", 0]}	2024-08-21	470.00	Kalarmannil House \nNilamel P.o \nKollam District\nKerala 691535	7012313146	SD	2024-08-21 00:00:00	f	2024-08-21	41.00			Elizabeth Abraham
128	{"1722667292353": [1, "540", 0]}	2024-08-21	540.00	Address\n     DHWANI\n    KADAMPATTUKONAM \n    KILIMANOOR (p.o) \n    Pin 695601\n    THIRUVANANTHAPURAM	8137837978	SD	2024-08-21 00:00:00	f	2024-08-21	41.00			ARCHANA
129	{"1722669041252": [1, "560", 0]}	2024-08-21	560.00	16/699\nELANTHIYANKODE HOUSE \nKUNNATHURMEDU POST\nPALAKKAD \nPIN CODE- 678013\n9605690242	9585412642	SD	2024-08-21 00:00:00	f	2024-08-21	47.00			JIPSA K N
131	{"1722667543366": [1, "650", 15], "1722668038531": [1, "1320", 15], "1722669333320": [0, "540", 15]}	2024-08-21	2074.00	Vikram villa 48 4th cross street artha prestine Avenue Lotus nagar periya koladi road ayyapakam chennai 77	7299950424	SD	2024-08-21 00:00:00	f	2024-08-21	71.00			Meenakshi Vikram 
133	{"1722663986020": [1, "399", 0]}	2024-08-21	399.00	TC- 65/190(1)\nValiyavila Amma Prasadam,\nPachalloor.P.O, Trivandrum.\nPin :- 695027\n	9544607216	SD	2024-08-21 00:00:00	f	2024-08-21	30.00			Akshaya Nair 
134	{"1722668613976": [1, "500", 0]}	2024-08-21	500.00	Athulya House \nthennoorkonam \nvizhinjam near maharaja automobiles and spider men  shop. \n695521	7012540601	SD	2024-08-21 00:00:00	f	2024-08-21	41.00			Ahalya
135	{"1722667543366": [1, "650", 0]}	2024-08-21	0.00	Delhi 	33333I’m 	SD	2024-08-21 00:00:00	t	2024-08-21	83.00			Gg
136	{"1722667912927": [1, "860", 0]}	2024-08-21	860.00	Calicut 	67777	SD	2024-08-21 00:00:00	f	2024-08-21	41.00			Teena 
137	{"1722667912927": [1, "860", 0]}	2024-08-21	860.00	Medayil\nPuthensanketham\nKoivila PO\nKollam\n691590	8086757840	SP	2024-08-21 00:00:00	f	\N	\N	\N	\N	Asitha Asokan
138	{"1722667246134": [1, "510", 15], "1722668613976": [1, "500", 15]}	2024-08-21	858.50	Muthayil Sreeni Villa \nEdakkattuvayal (P O)\nArakkunnam \nErnakulam \nPin 682313	8075825847	SP	2024-08-21 00:00:00	f	\N	\N	\N	\N	Nisha Anil
139	{"1722593118828": [1, "865", 20], "1722595612010": [1, "920", 20], "1722665042404": [1, "870", 20]}	2024-08-21	2124.00	D/o. Anil M C\nMuttumuhathu house\nKoovalloor po\nVakathipara- 686671\nPothanikadu\nKothamangalan \nErnakulam dist	9446862134	SP	2024-08-21 00:00:00	f	\N	\N	\N	\N	Merrin Anil
140	{"1722668613976": [1, "500", 0]}	2024-08-21	500.00	 Payyanat house house no 50 \nSreesailyam residence (po) kizhayoor \nPattambi \nPalakkad \n679303	8431390853	SP	2024-08-21 00:00:00	f	\N	\N	\N	\N	Indhulakshmi
141	{"1722665544365": [1, "280", 0], "1722667912927": [1, "860", 0]}	2024-08-21	1140.00	\nSaketham\nKazhakkunnu\nChullimanoor P O\nNedumangad \n695541\n	8086721371	SP	2024-08-21 00:00:00	f	\N	\N	\N	\N	Sreekala J S
142	{"1722665042404": [1, "870", 20], "1722667129273": [1, "620", 20], "1722667292353": [1, "540", 20], "1722667543366": [1, "650", 20], "1722668748905": [1, "470", 20], "1723211617238": [1, 300, 20], "1724238735187": [1, "880", 20]}	2024-08-21	3464.00	E-9,Triton, crescent, po. Nellikkode Kozhikode 673016\n 	9746408467	SP	2024-08-21 00:00:00	f	\N	\N	\N	\N	RAJALAKSHMI
\.


--
-- TOC entry 3660 (class 0 OID 0)
-- Dependencies: 210
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: illolam
--

SELECT pg_catalog.setval('public.items_id_seq', 246, true);


--
-- TOC entry 3661 (class 0 OID 0)
-- Dependencies: 212
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: illolam
--

SELECT pg_catalog.setval('public.sales_id_seq', 142, true);


--
-- TOC entry 3506 (class 2606 OID 24612)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: illolam
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 3508 (class 2606 OID 24614)
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: illolam
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- TOC entry 3657 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-08-21 20:12:42 IST

--
-- PostgreSQL database dump complete
--

