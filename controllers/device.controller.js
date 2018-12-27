const pool = require('../db');

const date = require('date-and-time');

var offset = 0;
var count = 10;
var pagerStart=0;

console.log('cert controller');

module.exports.deviceGetAll = function (request, response, next) {
console.log("device list all body response");
console.log(response.body);
    function countrec() {
        console.log("in select db func");
        return new Promise(function (resolve, reject) {
            pool.query('SELECT count(*) as rowcount \
        FROM devices INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
        inner join projects on projects.row_id = device_project_junc.project', (err, res) => {
                    kev = 2;
                    if (err) return next(err);
                    console.log(res.rows);
                    console.log('render test after promise');
                
                return rowcount;

                    // resolve(res.rows[0].rowid);
                }
            )
        })
    };

    function readdb() {
        console.log("in select db func "+username);
        var devicefilter = "";
        var projectfilter = "";
        if (request.body.certFilter) {
            certfilter = request.body.certFilter.toUpperCase();
        }
        if (request.body.projectFilter) {
            projectfilter = request.body.projectFilter.toUpperCase();
        }
        console.log("request query set to : "+request.query);

        console.log("first query vars : "+devicefilter+" : "+request.query.devicefilter);

        squery = 'SELECT devices.row_id as rowid, devices.name as devicename,projects.name as systemName,users.email as useremail \
        FROM devices \
        INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
        inner join projects on projects.row_id = device_project_junc.project \
        inner join users on users.id = projects.contact \
        WHERE UPPER(devices.name) like \'%'+devicefilter+'%\' and UPPER(projects.name) like \'%'+projectfilter+'%\' \
        ORDER BY devices.name ASC';

        squery = 'SELECT devices.row_id as rowid, devices.name as devicename,projects.name as systemName,users.email as useremail \
        FROM devices \
        INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
        inner join projects on projects.row_id = device_project_junc.project \
        inner join users on users.id = projects.contact \
        WHERE UPPER(devices.name) like \'%'+devicefilter+'%\' and UPPER(projects.name) like \'%'+projectfilter+'%\' \
        ORDER BY devices.name ASC';

        console.log("squery : "+squery);
        return new Promise(function (resolve, reject) {
            pool.query(squery, (err, res) => {
                    kev = 2;
                    if (err) return next(err);
                    console.log(res.rows);
                    console.log("second request query set to : "+request.query.devicefilter);
                    if (request.query && request.query.offset) {
                        offset = parseInt(request.query.offset, 10);
                    }

                    if (request.query && request.query.count) {
                        count = parseInt(request.query.count, 10);
                    }

                    console.log("res rows : "+res.rows);
                    // res.rows[0].rowcount = "test";
                    page_cnt=Math.ceil(res.rows.length/count);
                    console.log('render test after promise '+res.rows.length);
                    recordDetails = {totalRecords: res.rows.length,recPerPage: count,pageCount: Math.ceil(res.rows.length/count),currentPage: offset,pagerStart: pagerStart};
                    console.log(recordDetails);
                    response
                        .render('list_devices', { data: res.rows.slice(offset,offset+count), recordDetails: recordDetails, title: 'Cert Database' ,uname: username, accessLvl: accessLvl,devicefilter: devicefilter,projectfilter: projectfilter});

                    // resolve(res.rows[0].rowid);
                }
            )
        })
    };
    console.log("*********** request : "+request.body.deviceFilter);
    console.log("call db func");
    kev = "";
    rowcount=countrec();
    console.log("row count"+rowcount);
    readdb().then((rowid) => {
        console.log(rowid)//Value here is defined as u expect.
    });
    console.log("after db func");
};



module.exports.deviceGetOne = function (request, response, next) {
    console.log("running get single cert...");
    const id = request.params.deviceId;
    if (request.session.user && request.cookies.user_sid) {
    console.log("user during get device "+username);
    pool.query('SELECT row_id as projectid, name as projectname from projects', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    projects=res.rows;
    })
    squery = 'SELECT devices.row_id as rowid, devices.name as devicename,projects.name as projectname,users.email as useremail \
    FROM devices \
    INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
    inner join projects on projects.row_id = device_project_junc.project \
    inner join users on users.id = projects.contact \
    WHERE devices.row_id = $1';

    pool.query('SELECT devices.row_id as rowid, devices.name as devicename,projects.name as projectname,users.email as useremail \
    FROM devices \
    INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
    inner join projects on projects.row_id = device_project_junc.project \
    inner join users on users.id = projects.contact \
    WHERE devices.row_id = $1', [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            console.log(res.rows[0]);
            var devicename = "";
            var projectname = "";
            var contact = "";
            if (res.rows[0]) {
            var devicename = res.rows[0].devicename;
            var today = new Date();
            var projectname = res.rows[0].projectname;
            var contact = res.rows[0].useremail;
            };
            // console.log("project : "+projects[1].projectname);
            response
                .render('getDevice', { data: res.rows, projects: projects, title: 'Device : '+devicename, devicename: devicename,project: projectname, contact: contact,deviceid: id });
        })
    } else {
        console.log("exit 2");
        response.redirect('/login');
    }
};

module.exports.deviceAddOne = function (request, response, next) {
    console.log("running get single cert...");
    const id = request.params.deviceId;
    if (request.session.user && request.cookies.user_sid) {
    console.log("user during get device "+username);
    pool.query('SELECT row_id as projectid, name as projectname from projects', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    projects=res.rows;
    })
    squery = 'SELECT devices.row_id as rowid, devices.name as devicename,projects.name as projectname,users.email as useremail \
    FROM devices \
    INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
    inner join projects on projects.row_id = device_project_junc.project \
    inner join users on users.id = projects.contact \
    WHERE devices.row_id = $1';

    pool.query('SELECT devices.row_id as rowid, devices.name as devicename,projects.name as projectname,users.email as useremail \
    FROM devices \
    INNER JOIN device_project_junc ON devices.row_id = device_project_junc.device \
    inner join projects on projects.row_id = device_project_junc.project \
    inner join users on users.id = projects.contact \
    WHERE devices.row_id = $1', [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            console.log(res.rows[0]);
            var devicename = "";
            var projectname = "";
            var contact = "";
            if (res.rows[0]) {
            var devicename = res.rows[0].devicename;
            var today = new Date();
            var projectname = res.rows[0].projectname;
            var contact = res.rows[0].useremail;
            };
            // console.log("project : "+projects[1].projectname);
            response
                .render('getDevice', { data: res.rows, projects: projects, title: 'Device : '+devicename, devicename: devicename,project: projectname, contact: contact,deviceid: id });
        })
    } else {
        console.log("exit 2");
        response.redirect('/login');
    }
};



module.exports.certPost_upload_working = function(req,res,next){
    console.log("upload section");
    function insertcert(body) {
        console.log("upload : "+body);
    }
   
    // console.log('FIRST TEST: ' + JSON.stringify(req.files));
    console.log('second TEST: ' +req.files.theFile.name);
    next();
  };


module.exports.devicePost = function (request, response, next) {

    var list_projects="";

console.log("insert device");
    function insertdevice(body) {
        console.log("********************* insert device command");
        console.log(body);
        console.log("************************* body");
        var today = new Date();
        const { deviceid, devicename } = body;
        list_projects = body.project;
        console.log(devicename);
        console.log(list_projects);
        return new Promise(function (resolve, reject) {
            pool.query('INSERT INTO devices(name) VALUES($1)',
                [devicename],
                (err, res) => {
                    if (err) return next(err);
                    resolve(list_projects);
                    // response.redirect('/certs');
                }
            )
        })
    };

    function getmax() {
        console.log("get max");
        return new Promise(function (resolve, reject) {
            pool.query('select max(row_id) as max from devices', (err, res) => {
                if (err) return next(err);
                max = res.rows.max;
                resolve(res.rows.max);
                // response.redirect('/certs');
            }
            )
        })
    };

    insertdevice(request.body).then((project) => {
        console.log("insert device junc table");
        console.log(project);
        pool.query('select max(row_id) from devices', (err, res) => {
            if (err) return next(err);
            for (var projectid in list_projects) {
                console.log("add device and project to junc")
                console.log(list_projects[projectid])
            pool.query('INSERT INTO device_project_junc(device,project) VALUES($1, $2)',
                [res.rows[0].max, list_projects[projectid]],
                (err, res) => {
                    if (err) return next(err);
                })}
        })

        pool.query('select max(row_id) from devices', (err, res) => {
            if (err) return next(err);
            response.redirect('/certs');
        })
    });
    // response.redirect('/certs');
};



module.exports.certUpdatetest = function (req, res, next) {
    // let certFile = req.files.theFile;
    console.log("lefts do this");
    console.log(req.body);
};



module.exports.deviceUpdate = function (request, response, next) {
    var certFileName="";
    let certFile = request.files.newcertfile;
    console.log("check for a new file "+request.files.newcertfile);

        console.log("insert command");
        console.log(request.body);
        console.log(request.files);
        
        console.log("body");
        var today = new Date();
        const { certid,name, created_date, expiry_date, start_date, systems, } = request.body;


        return new Promise(function (resolve, reject) {
        console.log("lets do an update ");
        console.log("file name : "+usethisfilename);
            pool.query('UPDATE cert SET name = $2, created_date = $3, expiry_date = $4, start_date = $5, cert_file = $6 where row_id = $1',[certid,name, created_date, expiry_date, start_date, usethisfilename],(err, res) => {
            if (err) return next(err);
            console.log("insert : "+res);
            response.redirect('/certs');
        })});
};

