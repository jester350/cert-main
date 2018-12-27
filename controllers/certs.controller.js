const pool = require('../db');

const date = require('date-and-time');

var offset = 0;
var count = 10;
var pagerStart=0;

console.log('cert controller');

module.exports.certsGetAll = function (request, response, next) {
console.log("body response");
console.log(response.body);
    function countrec() {
        console.log("in select db func");
        return new Promise(function (resolve, reject) {
            pool.query('SELECT count(*) as rowcount \
        FROM cert INNER JOIN cert_device_junc ON cert.row_id = cert_device_junc.cert \
        inner join devices on devices.row_id = cert_device_junc.device', (err, res) => {
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
        var certfilter = "";
        var projectfilter = "";
        if (request.body.certFilter) {
            certfilter = request.body.certFilter.toUpperCase();
        }
        if (request.body.projectFilter) {
            projectfilter = request.body.projectFilter.toUpperCase();
        }
        console.log("request query set to : "+request.query);

        console.log("first query vars : "+certfilter+" : "+request.query.certfilter);

        squery = 'SELECT cert.row_id as rowid, cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,d.name as projectName,cert.cert_file as certFile,b.name as devicename \
        FROM cert \
        INNER JOIN cert_device_junc ON cert.row_id = cert_device_junc.cert \
        inner join devices b on b.row_id = cert_device_junc.device \
        inner join device_project_junc c on c.device = b.row_id \
        inner join projects d on d.row_id = c.project \
        ORDER BY certExpiryDate ASC';
        console.log("squery : "+squery);
        return new Promise(function (resolve, reject) {
            pool.query(squery, (err, res) => {
                    kev = 2;
                    if (err) return next(err);
                    console.log(res.rows);
                    console.log("second request query set to : "+request.query.certfilter);
                    if (request.query && request.query.offset) {
                        offset = parseInt(request.query.offset, 10);
                    }

                    if (request.query && request.query.count) {
                        count = parseInt(request.query.count, 10);
                    }

                    var today = new Date();
                    for (var i in res.rows) {

                        var daysLeft = date.subtract(res.rows[i].certexpirydate, today).toDays();
                        res.rows[i].daysleft = daysLeft;
                        var class_type = "alert alert-success";
                        if (daysLeft < 30) {
                            class_type = "alert alert-warning";
                        }
                        if (daysLeft < 7) {
                            class_type = "alert alert-danger";
                        }
                        res.rows[i].classtype=class_type;
                        sdate = date.format(res.rows[i].certstartdate, 'DD-MM-YYYY');
                        res.rows[i].certstartdate = sdate;

                        edate = date.format(res.rows[i].certexpirydate, 'DD-MM-YYYY');
                        res.rows[i].certexpirydate = edate;
                    }
                    console.log("res rows : "+res.rows);
                    // res.rows[0].rowcount = "test";
                    page_cnt=Math.ceil(res.rows.length/count);
                    console.log('render test after promise '+res.rows.length);
                    recordDetails = {totalRecords: res.rows.length,recPerPage: count,pageCount: Math.ceil(res.rows.length/count),currentPage: offset,pagerStart: pagerStart};
                    console.log(recordDetails);
                    response
                        .render('list_certs', { data: res.rows.slice(offset,offset+count), recordDetails: recordDetails, title: 'Cert Database' ,uname: username, accessLvl: accessLvl,certfilter: certfilter,projectfilter: projectfilter});

                    // resolve(res.rows[0].rowid);
                }
            )
        })
    };
    console.log("*********** request : "+request.body.certFilter);
    console.log("call db func");
    kev = "";
    rowcount=countrec();
    console.log("row count"+rowcount);
    readdb().then((rowid) => {
        console.log(rowid)//Value here is defined as u expect.
    });
    console.log("after db func");
};



module.exports.certsGetOne = function (request, response, next) {
    console.log("running get single cert...");
    const id = request.params.certId;
    if (request.session.user && request.cookies.user_sid) {
    console.log("user during get cert "+username);


    pool.query('SELECT row_id as projectid, name as projectname from projects', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    projects=res.rows;
    })

    pool.query('SELECT row_id as deviceid, name as devicename from devices', (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
    devices=res.rows;
    })

    pool.query('SELECT cert.row_id as rowid, cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,d.name as projectName,cert.cert_file as certFile,b.name as devicename,cert_device_junc.row_id as certdevicejuncid \
                FROM cert \
                INNER JOIN cert_device_junc ON cert.row_id = cert_device_junc.cert \
                inner join devices b on b.row_id = cert_device_junc.device \
                inner join device_project_junc c on c.device = b.row_id \
                inner join projects d on d.row_id = c.project \
                WHERE cert.row_id = $1', [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            var certname = res.rows[0].certname;
            var today = new Date();
            var projectname = res.rows[0].projectname;
            var sdate = date.format(res.rows[0].certstartdate, 'YYYY-MM-DD');
            var edate = date.format(res.rows[0].certexpirydate, 'YYYY-MM-DD');
            var daysLeft = date.subtract(res.rows[0].certexpirydate, today).toDays();
            var certdevicejuncid = res.rows[0].certdevicejuncid;
            // var sysname = res.rows[0].systemname;
            var certfile = res.rows[0].certfile;
            console.log("project : "+projects[1].projectname);
            response
                .render('getCert', { data: res.rows, projects: projects,devices: devices, title: 'Certificate: '+certname, certname: certname,sdate: sdate, edate: edate, projectname: projectname, dleft: daysLeft,certfile: certfile,certid: id,accessLvl: accessLvl,certdevicejuncid: certdevicejuncid });
        })
    } else {
        console.log("exit 2");
        response.redirect('/login');
    }
};

module.exports.certAddOne = function (request, response, next) {
    console.log("POST new cert"); 

    function runsql2 (sqlquery) {
        return new Promise((resolve, reject) => {
            pool.query(sqlquery, (err, res) => {
            if (err) {
              return reject (err)
            }
            resolve(res.rows)
          })
        })
      }


    console.log("call sync");
    Promise.all([
        runsql2('SELECT row_id as deviceid, name as devicename from devices'),
        runsql2('SELECT id as userId,email as userEmail from users')
      ])
      .then((result) => response.render('addCert', { devices: result[0],userlist:result[1], title: 'Add Cert' }))
      .catch((err) => console.log(err))
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


module.exports.certPost = function (request, response, next) {
    certFileName="";
    let certFile = request.files.theFile;
    if (certFile) {console.log("file upload details : "+certFile.name)
    certFile.mv(appRoot+'/uploads/'+certFile.name, function(err) {
        if (err)
          console.log("file upload failed "+err);
          console.log("file upload done");
        var fileUploaded = true;
      })
    certFileName=certFile.name};
    function insertcert(body) {
        console.log("insert command");
        console.log(body);
        console.log("body");
        var today = new Date();
        const { name, created_date, created_by, expiry_date, start_date, deviceid } = body;

        return new Promise(function (resolve, reject) {
            pool.query('INSERT INTO cert(name, created_date, created_by, expiry_date,start_date,cert_file) VALUES($1, $2, $3, $4, $5,$6)',
                [name, created_date, created_by, expiry_date, start_date,certFileName],
                (err, res) => {
                    if (err) return next(err);
                    resolve(deviceid);
                    // response.redirect('/certs');
                }
            )
        })
    };

    function getmax() {
        console.log("get max");
        return new Promise(function (resolve, reject) {
            pool.query('select max(row_id) as max from cert', (err, res) => {
                if (err) return next(err);
                max = res.rows.max;
                resolve(res.rows.max);
                // response.redirect('/certs');
            }
            )
        })
    };

    insertcert(request.body).then((device) => {
        console.log("junction body");
        console.log(request.body);
        var device = request.body.device;
        console.log(device);
        pool.query('select max(row_id) from cert', (err, res) => {
            if (err) return next(err);
            // console.log("max::");
            // console.log(res.rows[0].max);
            // console.log("done max 2" + system + ":" + res.rows[0].max)//Value here is defined as u expect.
            pool.query('INSERT INTO cert_device_junc(cert,device) VALUES($1, $2)',
                [res.rows[0].max, device],
                (err, res) => {
                    if (err) return next(err);
                });
        })

        pool.query('select max(row_id) from cert', (err, res) => {
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



module.exports.certUpdate = function (request, response, next) {
    var certFileName="";
    let certFile = request.files.newcertfile;
    console.log("check for a new file "+request.files.newcertfile);
    if (certFile) {console.log("file upload details : "+certFile.name)
    certFileName=certFile.name;
    certFile.mv(appRoot+'/uploads/'+certFile.name, function(err) {
        if (err)
          console.log("file upload failed "+err);
          console.log("file upload done");
        var fileUploaded = true;
      })};

        console.log("insert command");
        console.log(request.body);
        console.log(request.files);
        
        console.log("body");
        var today = new Date();
        const { certid,name, created_date, expiry_date, start_date, device,currentCertFile,certdevicejuncid } = request.body;
        var usethisfilename = currentCertFile;
        console.log(certFileName+" : "+currentCertFile);

        if (certFileName) {usethisfilename = certFileName};

        return new Promise(function (resolve, reject) {
        console.log("lets do an update ");
        console.log("file name : "+usethisfilename);
            pool.query('UPDATE cert SET name = $2, created_date = $3, expiry_date = $4, start_date = $5, cert_file = $6 where row_id = $1',[certid,name, created_date, expiry_date, start_date, usethisfilename],(err, res) => {
            if (err) return next(err);
            console.log("************** cert id : "+certid);
            console.log("************** device id : "+device);
            console.log("************** junction row : "+certdevicejuncid);
            pool.query('UPDATE cert_device_junc SET cert = certid, device = device WHERE row_id = certdevicejuncid',
            (err, res) => {
                if (err) return next(err);
            })
            console.log("insert : "+res);
            response.redirect('/certs');
        })});
};