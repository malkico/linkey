
CREATE SEQUENCE public.follower_id_seq;

CREATE TABLE public.follower (
                id INTEGER NOT NULL DEFAULT nextval('public.follower_id_seq'),
                ip_adress VARCHAR(15) NOT NULL,
                session VARCHAR(80) NOT NULL,
                CONSTRAINT follower_pk PRIMARY KEY (id)
);


ALTER SEQUENCE public.follower_id_seq OWNED BY public.follower.id;

CREATE INDEX follower_ip_adress_idx
 ON public.follower
 ( ip_adress );

CREATE SEQUENCE public.influencer_id_seq;

CREATE TABLE public.influencer (
                id INTEGER NOT NULL DEFAULT nextval('public.influencer_id_seq'),
                login VARCHAR(30) NOT NULL,
                mail BYTEA NOT NULL,
                password VARCHAR(30) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50),
                niche enum('Humor & Memes','Fashion & Style','Fitness','Quotes & Texts','Luxury & Motivation','Cars','Motorcycles','Nature','Food & Nutrition','Animals','Models','Ambassadors & Influencers','Music & Singers','Art','Technology','Gaming','Entrepreneurship','Architecture & Interior','Fan Accounts','Celebrity','Makeup','Hair','Nails','Sports','Love & Romance','Travel','Dogs','Cats','other') NOT NULL,
                CONSTRAINT influencer_pk PRIMARY KEY (id)
);


ALTER SEQUENCE public.influencer_id_seq OWNED BY public.influencer.id;

CREATE INDEX influencer_niche_idx
 ON public.influencer
 ( niche );

CREATE UNIQUE INDEX influencer_mail_idx
 ON public.influencer
 ( mail );

CREATE UNIQUE INDEX influencer_login_idx
 ON public.influencer
 ( login );

CREATE TABLE public.link (
                id INTEGER NOT NULL,
                key INTEGER NOT NULL,
                link varchar NOT NULL,
                title VARCHAR(120) NOT NULL,
                photo varchar,
                description varchar NOT NULL,
                main BOOLEAN NOT NULL,
                priority SMALLINT,
                type enum('web page','article','blog','promotional link','store','product','portfolio','personal website','other') NOT NULL,
                influencer_id INTEGER NOT NULL,
                CONSTRAINT link_pk PRIMARY KEY (id)
);


CREATE UNIQUE INDEX link_key_influencer_idx
 ON public.link
 ( key, influencer_id );

CREATE INDEX link_influencer_idx
 ON public.link
 ( influencer_id );

CREATE INDEX link_key_idx
 ON public.link
 ( key );

CREATE INDEX link_title_idx
 ON public.link
 ( title );

CREATE TABLE public.click (
                id INTEGER NOT NULL,
                date DATE NOT NULL,
                follower_id INTEGER NOT NULL,
                link_id INTEGER NOT NULL,
                CONSTRAINT click_pk PRIMARY KEY (id)
);


CREATE INDEX click_link_idx
 ON public.click
 ( link_id );

CREATE TABLE public.search (
                id INTEGER NOT NULL,
                keyword varchar NOT NULL,
                click_id INTEGER NOT NULL,
                CONSTRAINT search_pk PRIMARY KEY (id)
);


CREATE TABLE public.visit (
                id INTEGER NOT NULL,
                date DATE NOT NULL,
                influencer_id INTEGER NOT NULL,
                follower_id INTEGER NOT NULL,
                CONSTRAINT visit_pk PRIMARY KEY (id)
);


CREATE INDEX visit_influencer_idx
 ON public.visit
 ( influencer_id );

CREATE TABLE public.social_media (
                id INTEGER NOT NULL,
                which enum('instagram','facebook','twitter','snapchat','github','blog','store','portfolio','personal website','other') NOT NULL,
                link VARCHAR(120) NOT NULL,
                influencer_id INTEGER NOT NULL,
                CONSTRAINT social_media_pk PRIMARY KEY (id)
);


CREATE INDEX social_media_influencer_idx
 ON public.social_media
 ( influencer_id );

CREATE UNIQUE INDEX social_media_influencer_which_indx
 ON public.social_media
 ( which, influencer_id );

ALTER TABLE public.visit ADD CONSTRAINT follower_visit_fk
FOREIGN KEY (follower_id)
REFERENCES public.follower (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.click ADD CONSTRAINT follower_click_fk
FOREIGN KEY (follower_id)
REFERENCES public.follower (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.social_media ADD CONSTRAINT influencer_social_media_fk
FOREIGN KEY (influencer_id)
REFERENCES public.influencer (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.visit ADD CONSTRAINT influencer_visit_fk
FOREIGN KEY (influencer_id)
REFERENCES public.influencer (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.link ADD CONSTRAINT influencer_link_fk
FOREIGN KEY (influencer_id)
REFERENCES public.influencer (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.click ADD CONSTRAINT link_click_fk
FOREIGN KEY (link_id)
REFERENCES public.link (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.search ADD CONSTRAINT click_search_fk
FOREIGN KEY (click_id)
REFERENCES public.click (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;
