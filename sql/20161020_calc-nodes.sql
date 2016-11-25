-- drop table z_edges_more
select cs.id, array_agg(cp.yz_id) as nodes into z_edges_more 
	from courier_places cp, courier_segments cs 
 	where st_intersects(cs.geom,st_buffer(cp.geom,.02))
	group by cs.id;

-- select cs.id from courier_segments cs where cs.id not in
-- 	(select z.id from z_edges z)
-- 
-- select array_agg[1] from z_edges

update courier_segments cs set source = z.nodes[1] from z_edges_more z
	where cs.id = z.id;
update courier_segments cs set target = z.nodes[2] from z_edges_more z
	where cs.id = z.id;


-- labels
select cs.id,source,cp1.yz_label as slabel,target,cp2.yz_label as tlabel into z_labels
	from courier_segments cs
	left join courier_places cp1 on cs.source=cp1.sys_id 
	left join courier_places cp2 on cs.target=cp2.sys_id

-- there are a few segments with no nodes (or one)
select * from z_labels where slabel is null or tlabel is null

update courier_segments cs set label = z.slabel||' - '||z.tlabel from z_labels z
	where cs.id = z.id

select id,source,target,label,st_asgeojson(geom) as geom,maj_minor,src from courier_segments 
	where source is not null -- limit 100